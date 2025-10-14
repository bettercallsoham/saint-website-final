import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { authApi } from './services/authApi'

// Add debug functions to window in development
if (import.meta.env.DEV) {
  (window as any).clearAuthState = authApi.clearAuthState;
  (window as any).authApi = authApi;
}

createRoot(document.getElementById("root")!).render(<App />);
