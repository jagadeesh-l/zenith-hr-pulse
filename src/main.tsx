
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Check for user's theme preference before rendering
const userTheme = localStorage.getItem("theme") || "light";
if (userTheme === "dark" || (!userTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

createRoot(document.getElementById("root")!).render(<App />);
