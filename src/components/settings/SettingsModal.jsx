// src/components/settings/SettingsModal.jsx
import React, { useState, useEffect } from "react";
import { motion } from "@motionone/react";
import { apiPost } from "../../utils/api";

// Components
import EditFeaturedModal from "./EditFeatured";
import EditPlaylistsModal from "./EditPlaylists";

function SettingsModal({ isOpen, onClose, onLogout, onDelete, user_id, onSave }) {
  const [isEditOpen, setEditOpen] = useState(false);
  const [isPlaylistEditorOpen, setPlaylistEditorOpen] = useState(false);
  const [visible, setVisible] = useState(isOpen);

  const handleClearGenreCache = async () => {
    try {
      await apiPost("/refresh_genres", { user_id });
      alert("Your genre data is being refreshed!");
    } catch (err) {
      console.error("Failed to clear genre cache:", err);
      alert("Something went wrong. Try again later.");
    }
  };

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 250);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!visible) return null;

  const buttons = [
    {
      label: "✏️ Edit Featured Playlists",
      onClick: () => setEditOpen(true),
      className: "w-full px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-700 rounded text-left",
    },
    {
      label: "🔄 Update Playlists",
      onClick: () => setPlaylistEditorOpen(true),
      className: "w-full px-4 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-700 rounded text-left",
    },
    {
      label: "🏃🏼‍♂️ Log out",
      onClick: onLogout,
      className: "w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-700 rounded text-left",
    },
    {
      label: "🗑️ Delete account",
      onClick: onDelete,
      className: "w-full px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-700 rounded text-left text-red-700 dark:text-red-300",
    },
    {
      label: "🧹 Clear Genre Cache (buggy but stable)",
      onClick: handleClearGenreCache,
      className: "w-full px-4 py-2 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900 dark:hover:bg-yellow-700 rounded text-left",
    },
    {
      label: "Back",
      onClick: onClose,
      className: "w-full mt-4 text-sm text-gray-600 dark:text-gray-300 underline text-left",
    },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            className="modal-container max-w-md w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="text-xl font-bold mb-4">⚙️ Settings</h2>
            <div className="flex flex-col space-y-3">
              {buttons.map(({ label, onClick, className }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                >
                  <button onClick={onClick} className={className}>
                    {label}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* 🎛 Modals */}
      <EditFeaturedModal
        isOpen={isEditOpen}
        onClose={() => setEditOpen(false)}
        user_id={user_id}
        onSave={onSave}
      />
      <EditPlaylistsModal
        isOpen={isPlaylistEditorOpen}
        onClose={() => setPlaylistEditorOpen(false)}
        user_id={user_id}
      />
    </>
  );
}

export default SettingsModal;