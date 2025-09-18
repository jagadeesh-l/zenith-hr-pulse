
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { MsalProvider } from '@azure/msal-react'
import { msalInstance } from './auth/msal'

// Check for user's theme preference before rendering
const userTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

// Apply theme class immediately before render
if (userTheme === "dark" || (!userTheme && prefersDark)) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

createRoot(document.getElementById("root")!).render(
  <MsalProvider instance={msalInstance}>
    <App />
  </MsalProvider>
);
