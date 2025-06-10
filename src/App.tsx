
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { LazyRoutes } from "@/components/LazyRoutes";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <LazyRoutes />
          <Toaster />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
