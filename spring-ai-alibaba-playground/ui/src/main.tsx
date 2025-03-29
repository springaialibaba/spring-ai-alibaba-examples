import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Independent from "./App";
import React from "react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Independent />
  </StrictMode>
);
