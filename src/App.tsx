
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GuidedHelp from "./pages/GuidedHelp";
import EnhancedGuidedHelp from "./pages/EnhancedGuidedHelp";
import Documents from "./pages/dashboard/Documents";
import MyDocuments from "./pages/dashboard/MyDocuments";
import Overview from "./pages/dashboard/Overview";
import EnhancedOverview from "./pages/dashboard/EnhancedOverview";
import DocumentCustomizer from "./pages/dashboard/DocumentCustomizer";
import AdminDocuments from "./pages/admin/AdminDocuments";
import VideoTest from "./pages/admin/VideoTest";
import StorageTest from "./pages/admin/StorageTest";
import ContentMigration from "./pages/ContentMigration";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Onboarding from "./pages/Onboarding";
import Pricing from "./pages/Pricing";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import Disclaimer from "./pages/Disclaimer";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard/overview" replace />} />
                <Route path="overview" element={<EnhancedOverview />} />
                <Route path="documents" element={<Documents />} />
                <Route path="my-documents" element={<MyDocuments />} />
                <Route path="document-customizer" element={<DocumentCustomizer />} />
              </Route>
              <Route
                path="/guided-help"
                element={
                  <ProtectedRoute>
                    <GuidedHelp />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/enhanced-guided-help"
                element={
                  <ProtectedRoute>
                    <EnhancedGuidedHelp />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/documents"
                element={
                  <ProtectedRoute>
                    <AdminDocuments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/video-test"
                element={
                  <ProtectedRoute>
                    <VideoTest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/storage-test"
                element={
                  <ProtectedRoute>
                    <StorageTest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/content-migration"
                element={
                  <ProtectedRoute>
                    <ContentMigration />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-success"
                element={
                  <ProtectedRoute>
                    <PaymentSuccess />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-cancel"
                element={
                  <ProtectedRoute>
                    <PaymentCancel />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
