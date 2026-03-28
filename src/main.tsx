import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const missingSupabaseEnv =
  !import.meta.env.VITE_SUPABASE_URL ||
  !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (missingSupabaseEnv) {
  createRoot(rootElement).render(
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <div>
        <h1 style={{ marginBottom: "8px" }}>Configuration Error</h1>
        <p style={{ margin: 0 }}>
          Missing Supabase environment variables. Set
          <code> VITE_SUPABASE_URL </code>
          and
          <code> VITE_SUPABASE_PUBLISHABLE_KEY </code>
          in your environment and redeploy.
        </p>
      </div>
    </div>
  );
} else {
  // Enable strict mode for better development warnings
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
