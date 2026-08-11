// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );


import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// 1. Import your ThemeProvider here
import { ThemeProvider } from "./context/ThemeContext"; 

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* 2. Wrap your App component with it */}
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);