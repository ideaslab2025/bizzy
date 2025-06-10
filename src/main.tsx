
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './hooks/useAuth'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
