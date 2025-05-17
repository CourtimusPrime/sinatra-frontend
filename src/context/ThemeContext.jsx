// src/context/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { backgrounds, fonts, textColors } from "../themes/customizations";
import { useUser } from "./UserContext"; // 🔁 assuming you store `user_id` here

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [previewTheme, setPreviewTheme] = useState(null);
  const [background, setBackground] = useState(() => localStorage.getItem("custom-bg") || "");
  const [font, setFont] = useState(() => localStorage.getItem("custom-font") || "");
  const [textColor, setTextColor] = useState(() => localStorage.getItem("custom-text") || "");

  const { user_id } = useUser();

  const isPublicView = typeof window !== "undefined" && window.location.pathname.startsWith("/user");

  // Restore theme settings on login
  useEffect(() => {
    if (!user_id || isPublicView) return;

    async function loadUserTheme() {
      try {
        const res = await fetch(`/get-theme?user_id=${user_id}`);
        const data = await res.json();

        if (data.theme) setTheme(data.theme);
        if (data.background) setBackground(data.background);
        if (data.font) setFont(data.font);
        if (data.text_color) setTextColor(data.text_color);
      } catch (err) {
        console.error("Failed to load user theme:", err);
      }
    }

    loadUserTheme();
  }, [user_id]);

  // 🧠 Save theme settings to MongoDB
  const saveToServer = async () => {
    if (!user_id || isPublicView) return;

    const payload = {
      user_id: user_id,
      theme,
      background,
      font,
      text_color: textColor,
    };

    try {
      const res = await fetch("/save-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("save-theme failed", res.status);
        return;
      }

      const data = await res.json();
      console.log("Theme saved:", data);
    } catch (err) {
      console.error("Failed to save theme:", err);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark", "solarized", "neon", "vaporwave", "mono");
    root.classList.add(previewTheme || theme);

    localStorage.setItem("theme", theme);
    saveToServer();
  }, [theme]);

  useEffect(() => {
    if (background) {
      document.body.className = background;
      localStorage.setItem("custom-bg", background);
      saveToServer();
    }
  }, [background]);

  useEffect(() => {
    if (font) {
      document.body.classList.add(font);
      localStorage.setItem("custom-font", font);
      saveToServer();
    }
  }, [font]);

  useEffect(() => {
    if (textColor) {
      textColors.forEach((t) => document.body.classList.remove(t.class));
      document.body.classList.add(textColor);
      localStorage.setItem("custom-text", textColor);
      saveToServer();
    }
  }, [textColor]);

  const tempPreview = (value) => setPreviewTheme(value);
  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  const surpriseTheme = () => {
    const options = ["light", "dark", "solarized", "neon", "vaporwave", "mono"];
    setTheme(options[Math.floor(Math.random() * options.length)]);
  };

  return (
    <ThemeContext.Provider value={{
      theme, setTheme,
      background, setBackground,
      font, setFont,
      textColor, setTextColor,
      toggleTheme, tempPreview, surpriseTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}
