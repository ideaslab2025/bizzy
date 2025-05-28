
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import EnhancedGuidedHelp from "./pages/EnhancedGuidedHelp";
import Pricing from "./pages/Pricing";
import ContentMigration from "./pages/ContentMigration";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/guided-help" element={<EnhancedGuidedHelp />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/content-migration" element={<ContentMigration />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
