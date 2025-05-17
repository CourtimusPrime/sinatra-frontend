// src/components/settings/ThemePickerModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { backgrounds, fonts, textColors } from "../../themes/customizations";

const themes = [
  { id: "light", label: "🌞 Light", color: "bg-white border" },
  { id: "dark", label: "🌙 Dark", color: "bg-gray-800 border border-white" },
  { id: "solarized", label: "🌅 Solarized", color: "bg-yellow-100 border-yellow-300" },
  { id: "neon", label: "🪩 Neon", color: "bg-pink-500 border-pink-700" },
  { id: "vaporwave", label: "🌸 Vaporwave", color: "bg-purple-300 border-purple-500" },
  { id: "mono", label: "⚫ Mono", color: "bg-gray-600 border-gray-700" },
];

function ThemePickerModal({ isOpen, onClose }) {
  const { theme, setTheme, surpriseTheme } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="modal-container max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold mb-4">🎨 Choose a Theme</h2>

            {/* Preset Themes */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setBackground(""); // reset customizations
                    setFont("");
                    setTextColor("");
                    localStorage.removeItem("custom-bg");
                    localStorage.removeItem("custom-font");
                    localStorage.removeItem("custom-text");
                    onClose();
                  }}
                  className={`rounded-lg h-20 flex items-center justify-center font-bold ${t.color} transition transform hover:scale-105 focus:ring-2 focus:ring-offset-2 ${
                    theme === t.id ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                surpriseTheme();
                onClose();
              }}
              className="mb-6 text-sm text-blue-600 underline"
            >
              🎲 Surprise Me
            </button>

            {/* Manual Customization */}
            <h2 className="text-lg font-bold mt-2 mb-2">🖼 Background</h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {backgrounds.map((bg) => (
                <button
                  key={bg.id}
                  className={`h-10 rounded ${bg.class} border text-xs`}
                  onClick={() => {
                    document.body.className = document.body.className
                      .split(" ")
                      .filter((cls) => !cls.startsWith("bg-"))
                      .join(" ");
                    document.body.classList.add(...bg.class.split(" "));
                    localStorage.setItem("custom-bg", bg.class);
                  }}
                >
                  {bg.label}
                </button>
              ))}
            </div>

            <h2 className="text-lg font-bold mt-2 mb-2">🔤 Font</h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {fonts.map((f) => (
                <button
                  key={f.id}
                  className={`rounded border px-3 py-2 text-xs ${f.class}`}
                  onClick={() => {
                    document.body.classList.remove(...fonts.map((ff) => ff.class));
                    document.body.classList.add(f.class);
                    localStorage.setItem("custom-font", f.class);
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <h2 className="text-lg font-bold mt-2 mb-2">🎨 Text Color</h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {textColors.map((tc) => (
                <button
                  key={tc.id}
                  className={`rounded px-3 py-2 border text-xs ${tc.class}`}
                  onClick={() => {
                    document.body.classList.remove(...textColors.map((t) => t.class));
                    document.body.classList.add(tc.class);
                    localStorage.setItem("custom-text", tc.class);
                  }}
                >
                  {tc.label}
                </button>
              ))}
            </div>

            {/* Close */}
            <button onClick={onClose} className="text-sm underline mt-2">
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ThemePickerModal;