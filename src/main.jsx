import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Correct imports for v7.2.0
import AuthProvider from "./providers/AuthProvider"; // Import your AuthProvider
import AppRoutes from "./router/router"; // Import your AppRoutes
import "./index.css";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />{" "}
          {/* AppRoutes should be the routes component directly */}
        </BrowserRouter>
        <Toaster position="top-right" reverseOrder={false}/>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
