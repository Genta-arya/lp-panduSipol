import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Import ini
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "sonner";
import { ThemeProvider } from "./Lib/ThemeContext.jsx";
import AppRoutes from "./Routes.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
  
        <AppRoutes/>
        <Toaster position="top-right" richColors />
      
    </ThemeProvider>
  </StrictMode>,
);
