
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PLAN_PRICES = {
  bronze: 10000,   // £100.00 in pence
  silver: 20000,   // £200.00 in pence
  gold: 30000,     // £300.00 in pence
  platinum: 50000, // £500.00 in pence
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Early check for required environment variables
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeKey) {
      logStep("⚠️ Missing STRIPE_SECRET_KEY");
      return new Response(
        JSON.stringify({ error: "Payment server misconfigured - missing Stripe key" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      logStep("⚠️ Missing Supabase configuration");
      return new Response(
        JSON.stringify({ error: "Payment server misconfigured - missing Supabase config" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    logStep("Environment variables verified");

    // Create Supabase client using anon key for user authentication
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("⚠️ No authorization header provided");
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !userData.user?.email) {
      logStep("⚠️ Authentication failed", { authError });
      return new Response(
        JSON.stringify({ error: "Invalid authentication token" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const user = userData.user;
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Get plan from request body - improved JSON parsing
    let requestBody;
    try {
      const rawBody = await req.text();
      logStep("Raw request body received", { body: rawBody });
      
      if (!rawBody || rawBody.trim() === '') {
        throw new Error("Empty request body");
      }
      
      requestBody = JSON.parse(rawBody);
      logStep("Request body parsed successfully", { requestBody });
    } catch (error) {
      logStep("⚠️ Invalid JSON in request body", { error: error.message });
      return new Response(
        JSON.stringify({ error: "Invalid request format - unable to parse JSON" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const { planId } = requestBody;
    logStep("Plan request received", { planId });

    if (!planId || !PLAN_PRICES[planId as keyof typeof PLAN_PRICES]) {
      logStep("⚠️ Invalid plan selected", { planId, availablePlans: Object.keys(PLAN_PRICES) });
      return new Response(
        JSON.stringify({ error: "Invalid plan selected" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const amount = PLAN_PRICES[planId as keyof typeof PLAN_PRICES];
    logStep("Plan validated", { planId, amount });

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });
    logStep("Stripe initialized");

    // Check if a Stripe customer record exists for this user
    let customers;
    try {
      customers = await stripe.customers.list({ email: user.email, limit: 1 });
      logStep("Stripe customer lookup completed", { foundCustomers: customers.data.length });
    } catch (stripeError) {
      logStep("⚠️ Stripe customer lookup failed", { stripeError });
      return new Response(
        JSON.stringify({ error: "Payment service temporarily unavailable" }),
        {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      logStep("No existing customer found, will create new one");
    }

    // Create a one-time payment session
    let session;
    try {
      session = await stripe.checkout.sessions.create({
        customer: customerId,
        customer_email: customerId ? undefined : user.email,
        line_items: [
          {
            price_data: {
              currency: "gbp",
              product_data: { 
                name: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
                description: `One-time payment for ${planId} business setup package`
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.get("origin")}/pricing`,
        metadata: {
          user_id: user.id,
          plan_type: planId,
        },
      });
      logStep("Stripe checkout session created", { sessionId: session.id, url: session.url });
    } catch (stripeError) {
      logStep("⚠️ Stripe session creation failed", { stripeError });
      return new Response(
        JSON.stringify({ error: "Failed to create payment session" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Create order record in Supabase using service role key (if available)
    if (supabaseServiceKey) {
      try {
        const supabaseService = createClient(supabaseUrl, supabaseServiceKey, { 
          auth: { persistSession: false } 
        });

        const { error: orderError } = await supabaseService.from("orders").insert({
          user_id: user.id,
          stripe_session_id: session.id,
          amount: amount,
          currency: "gbp",
          plan_type: planId,
          status: "pending",
        });

        if (orderError) {
          logStep("⚠️ Order creation failed (non-critical)", { orderError });
          // Continue anyway, the payment session is created
        } else {
          logStep("Order record created successfully");
        }
      } catch (dbError) {
        logStep("⚠️ Database operation failed (non-critical)", { dbError });
        // Continue anyway, the payment session is created
      }
    } else {
      logStep("⚠️ No service role key available, skipping order creation");
    }

    logStep("Payment session created successfully", { sessionUrl: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("⚠️ Unexpected error", { error: errorMessage, stack: error instanceof Error ? error.stack : undefined });
    
    return new Response(JSON.stringify({ 
      error: "An unexpected error occurred. Please try again." 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
