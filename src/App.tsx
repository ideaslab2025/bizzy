
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import EnhancedOverview from "./pages/dashboard/EnhancedOverview";
import Documents from "./pages/dashboard/Documents";
import MyDocuments from "./pages/dashboard/MyDocuments";
import DocumentCustomizer from "./pages/dashboard/DocumentCustomizer";
import EnhancedGuidedHelp from "./pages/EnhancedGuidedHelp";
import ProgressCompanion from "./pages/ProgressCompanion";
import Pricing from "./pages/Pricing";
import ContentMigration from "./pages/ContentMigration";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmailVerification from "./pages/EmailVerification";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import Disclaimer from "./pages/Disclaimer";
import NotFound from "./pages/NotFound";
import StorageTest from "./pages/admin/StorageTest";
import AdminDocuments from "./pages/admin/AdminDocuments";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }>
              <Route index element={<EnhancedOverview />} />
              <Route path="documents" element={<Documents />} />
              <Route path="my-documents" element={<MyDocuments />} />
              <Route path="documents/customize/:id" element={<DocumentCustomizer />} />
              <Route path="consultations" element={<div className="p-6"><h1 className="text-2xl font-bold">Consultations</h1><p>Coming soon...</p></div>} />
              <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p>Coming soon...</p></div>} />
            </Route>
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/guided-help" element={<EnhancedGuidedHelp />} />
            <Route path="/progress-companion" element={
              <ProtectedRoute>
                <ProgressCompanion />
              </ProtectedRoute>
            } />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/content-migration" element={<ContentMigration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/email-verification" element={<EmailVerification />} />
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/admin/storage-test" element={<StorageTest />} />
            <Route path="/admin/documents" element={<AdminDocuments />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
