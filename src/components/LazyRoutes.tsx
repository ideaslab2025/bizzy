
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load all route components
const Index = React.lazy(() => import('@/pages/Index'));
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const EnhancedOverview = React.lazy(() => import('@/pages/dashboard/EnhancedOverview'));
const Documents = React.lazy(() => import('@/pages/dashboard/Documents'));
const OptimizedDocuments = React.lazy(() => import('@/pages/dashboard/OptimizedDocuments'));
const MyDocuments = React.lazy(() => import('@/pages/dashboard/MyDocuments'));
const DocumentCustomizer = React.lazy(() => import('@/pages/dashboard/DocumentCustomizer'));
const EnhancedGuidedHelp = React.lazy(() => import('@/pages/dashboard/EnhancedGuidedHelp'));
const Settings = React.lazy(() => import('@/pages/dashboard/Settings'));
const ProgressCompanion = React.lazy(() => import('@/pages/ProgressCompanion'));
const Pricing = React.lazy(() => import('@/pages/Pricing'));
const Login = React.lazy(() => import('@/pages/Login'));
const Register = React.lazy(() => import('@/pages/Register'));
const EmailVerification = React.lazy(() => import('@/pages/EmailVerification'));
const EmailVerificationSuccess = React.lazy(() => import('@/pages/EmailVerificationSuccess'));
const Profile = React.lazy(() => import('@/pages/Profile'));
const Onboarding = React.lazy(() => import('@/pages/Onboarding'));

// Loading component
const PageLoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

export const LazyRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<EnhancedOverview />} />
          <Route path="documents" element={<OptimizedDocuments />} />
          <Route path="my-documents" element={<MyDocuments />} />
          <Route path="documents/customize/:id" element={<DocumentCustomizer />} />
          <Route path="guided-help" element={<EnhancedGuidedHelp />} />
          <Route path="consultations" element={
            <div className="p-6">
              <h1 className="text-2xl font-bold">Consultations</h1>
              <p>Coming soon...</p>
            </div>
          } />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/progress-companion" element={<ProgressCompanion />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/email-verification-success" element={<EmailVerificationSuccess />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Routes>
    </Suspense>
  );
};
