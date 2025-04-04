import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRoutes />
    <Toaster position="top-center" reverseOrder={false} />
  </StrictMode>
);
