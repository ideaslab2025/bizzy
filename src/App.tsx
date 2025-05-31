
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Documents from './pages/dashboard/Documents';
import DocumentCustomizer from './pages/dashboard/DocumentCustomizer';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import AdminDocumentUpload from '@/pages/admin/DocumentUpload';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
          <Route path="/admin/documents" element={
            <ProtectedRoute>
              <AdminDocumentUpload />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
