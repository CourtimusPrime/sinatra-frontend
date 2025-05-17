// src/components/settings/SettingsModal.jsx
import React, { useState } from "react";
import EditFeaturedModal from "./EditFeatured";
import ThemePickerModal from "./ThemePickerModal";
import { motion, AnimatePresence } from "framer-motion/dom";
import { useTheme } from "../../context/ThemeContext";

function SettingsModal({
  isOpen,
  onClose,
  onLogout,
  onDelete,
  user_id,
  onSave,
}) {
  const [isEditOpen, setEditOpen] = useState(false);
  const [isThemeOpen, setThemeOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <>
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
              <h2 className="text-xl font-bold mb-4">⚙️ Settings</h2>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => setEditOpen(true)}
                  className="w-full px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-700 rounded text-left"
                >
                  ✏️ Edit Featured Playlists
                </button>

                <button
                  onClick={toggleTheme}
                  className="w-full px-4 py-2 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-700 rounded text-left"
                >
                  {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
                </button>

                <button
                  onClick={() => setThemeOpen(true)}
                  className="w-full px-4 py-2 bg-pink-100 hover:bg-pink-200 dark:bg-pink-900 dark:hover:bg-pink-700 rounded text-left"
                >
                  🎨 Pick Theme
                </button>

                <button
                  onClick={onLogout}
                  className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-700 rounded text-left"
                >
                  🏃🏼‍♂️ Log out
                </button>

                <button
                  onClick={onDelete}
                  className="w-full px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-700 rounded text-left text-red-700 dark:text-red-300"
                >
                  🗑️ Delete account
                </button>

                <button
                  onClick={onClose}
                  className="w-full mt-4 text-sm text-gray-600 dark:text-gray-300 underline"
                >
                  Back
                </button>

                <p className="text-sm text-gray-500 dark:text-gray-300 mt-4 text-center">
  Current theme: <span className="font-semibold">{theme}</span>
</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🎛 Modals below */}
      <EditFeaturedModal
        isOpen={isEditOpen}
        onClose={() => setEditOpen(false)}
        user_id={user_id}
        onSave={onSave}
      />

      <ThemePickerModal
        isOpen={isThemeOpen}
        onClose={() => setThemeOpen(false)}
      />
    </>
  );
}

export default SettingsModal;