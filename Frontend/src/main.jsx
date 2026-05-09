import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";

import "./style.scss";

import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#1e1e1e",
          color: "#fff",
          border: "1px solid #2c2c2c",
          padding: "14px 16px",
          fontSize: "14px",
        },
      }}
    />

    <App />
  </StrictMode>,
);
