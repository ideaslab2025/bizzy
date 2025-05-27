
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

serve(async (req) => {
  console.log("Function started, method:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create Supabase client using anon key for user authentication
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    console.log("Parsing request body...");
    const body = await req.json();
    console.log("Request body:", body);
    
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    console.log("Getting user from token...");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) {
      console.error("User not authenticated or email not available");
      throw new Error("User not authenticated or email not available");
    }
    console.log("User authenticated:", user.email);

    // Get plan from request body
    const { planId } = body;
    console.log("Plan ID received:", planId);
    
    if (!planId || !PLAN_PRICES[planId as keyof typeof PLAN_PRICES]) {
      console.error("Invalid plan selected:", planId);
      throw new Error("Invalid plan selected");
    }

    const amount = PLAN_PRICES[planId as keyof typeof PLAN_PRICES];
    console.log("Plan amount:", amount);

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("STRIPE_SECRET_KEY environment variable not set");
      throw new Error("Payment system not configured");
    }
    
    console.log("Initializing Stripe...");
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Check if a Stripe customer record exists for this user
    console.log("Looking for existing customer...");
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("Found existing customer:", customerId);
    } else {
      console.log("No existing customer found");
    }

    // Create a one-time payment session
    console.log("Creating checkout session...");
    const session = await stripe.checkout.sessions.create({
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

    console.log("Checkout session created:", session.id);

    // Create order record in Supabase using service role key
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    console.log("Creating order record...");
    const { error: orderError } = await supabaseService.from("orders").insert({
      user_id: user.id,
      stripe_session_id: session.id,
      amount: amount,
      currency: "gbp",
      plan_type: planId,
      status: "pending",
    });

    if (orderError) {
      console.error("Error creating order:", orderError);
      // Continue anyway, the payment session is created
    } else {
      console.log("Order record created successfully");
    }

    console.log("Returning session URL:", session.url);
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: "Check the function logs for more information"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
