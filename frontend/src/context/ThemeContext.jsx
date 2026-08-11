import { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Check local storage so the website remembers your choice after a refresh
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem("app-theme") || "cyan";
  });

  // Save the theme whenever it changes
  useEffect(() => {
    localStorage.setItem("app-theme", activeTheme);
  }, [activeTheme]);

  const toggleTheme = () => {
    setActiveTheme((prev) => (prev === "cyan" ? "gold" : "cyan"));
  };

  // Define the colors globally here so ANY component can use them
  const themeColors = activeTheme === "cyan" ? {
    name: "cyan",
    bgOpacity: "rgba(5, 9, 20, 0.85)",        
    accent: "#00d4ff",                        
    accentGlow: "rgba(0, 212, 255, 0.3)",
    border: "rgba(0, 212, 255, 0.4)",
    textMain: "#FFFFFF",
    textMuted: "rgba(0, 212, 255, 0.7)",
    boxBg: "rgba(0, 20, 40, 0.4)",
  } : {
    name: "gold",
    bgOpacity: "rgba(5, 5, 5, 0.9)",          
    accent: "#FFC000",                        
    accentGlow: "rgba(255, 192, 0, 0.3)",
    border: "rgba(255, 192, 0, 0.4)",
    textMain: "#FFFFFF",
    textMuted: "rgba(255, 192, 0, 0.7)",
    boxBg: "rgba(15, 15, 15, 0.8)",
  };

  return (
    <ThemeContext.Provider value={{ activeTheme, toggleTheme, setActiveTheme, theme: themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);