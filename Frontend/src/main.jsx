import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { ShopProvider } from "../src/components/Cart/ShopContext.jsx";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ShopProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <App />
    </ShopProvider>
  </StrictMode>,
);
