// ============================================================
// FILE: src/main.tsx
// PURPOSE: App bootstrap. Mounts React root and router.
// ------------------------------------------------------------
// ASCII FLOW:
//   DOM load -> createRoot(#root) -> <BrowserRouter><App/></BrowserRouter>
// ============================================================
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import "./app/theme.css";

const application_root_element = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(application_root_element).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
