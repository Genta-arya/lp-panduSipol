import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Import ini
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "sonner";
import { ThemeProvider } from "./Lib/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
