import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Modal from "react-modal";
import App from "./App.jsx";
import "./index.css";

Modal.setAppElement("#root");

const fontUrl = import.meta.env.VITE_FONT_URL;
const fontName = import.meta.env.VITE_FONT_NAME;

if (fontUrl && fontName) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = fontUrl;
  document.head.appendChild(link);
  document.documentElement.style.setProperty("--font-family", fontName);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
