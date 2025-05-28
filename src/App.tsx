import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import DocumentEditor from "./pages/DocumentEditor";
import Settings from "./pages/Settings";
import Authentication from "./pages/Authentication";
import EnhancedGuidedHelp from "./pages/EnhancedGuidedHelp";
import Pricing from "./pages/Pricing";
import ContentMigration from "./pages/ContentMigration";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Authentication />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/document-editor/:id" element={<DocumentEditor />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/guided-help" element={<EnhancedGuidedHelp />} />
          <Route path="/pricing" element={<Pricing />} />
          
          <Route path="/content-migration" element={<ContentMigration />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
