import React from 'react';
import { QueryClient } from "react-query";
import { ThemeProvider } from "@/components/ui/theme-provider"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Documents from './pages/dashboard/Documents';
import CustomizeDocument from './pages/dashboard/CustomizeDocument';
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

function App() {
  return (
    <QueryClient>
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
            <Route path="/dashboard/documents/customize/:documentId" element={
              <ProtectedRoute>
                <CustomizeDocument />
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
            <Route path="*" element={<NotFound />} />
            <Route path="/admin/documents" element={
              <ProtectedRoute>
                <AdminDocumentUpload />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClient>
  );
}

export default App;
