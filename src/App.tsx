
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@/components/ui/theme-provider"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Documents from './pages/dashboard/Documents';
import DocumentCustomizer from './pages/dashboard/DocumentCustomizer';
import Guidance from './pages/Guidance';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import NotFound from './pages/NotFound';
import { useAuth } from './hooks/useAuth';
import { GuidanceProvider } from './contexts/GuidanceContext';
import AdminDocumentUpload from '@/pages/admin/DocumentUpload';
import { AuthProvider } from './hooks/useAuth';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <Router>
            <Routes>
              <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/documents" element={
                <ProtectedRoute>
                  <Documents />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/documents/customize/:id" element={
                <ProtectedRoute>
                  <DocumentCustomizer />
                </ProtectedRoute>
              } />
              <Route path="/guidance" element={
                <ProtectedRoute>
                  <GuidanceProvider>
                    <Guidance />
                  </GuidanceProvider>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/admin/documents" element={
                <ProtectedRoute>
                  <AdminDocumentUpload />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
