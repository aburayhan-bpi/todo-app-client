import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Correct imports for v7.2.0
import AuthProvider from "./providers/AuthProvider"; // Import your AuthProvider
import AppRoutes from "./router/router"; // Import your AppRoutes
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes /> {/* AppRoutes should be the routes component directly */}
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
