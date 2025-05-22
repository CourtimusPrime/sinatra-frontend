// src/components/settings/SettingsModal.jsx
import React, { useState, useEffect } from "react";
import { motion } from "@motionone/react";
import { apiPost } from "../../utils/api"; // 👈 place this near the top

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

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div className="modal-container max-w-md w-full max-h-[90vh] overflow-y-auto" /* other motion props */>
            <h2 className="text-xl font-bold mb-4">⚙️ Settings</h2>
            <div className="flex flex-col space-y-3">
              {/* Existing buttons */}
              <button onClick={() => setEditOpen(true)} className="...">
                ✏️ Edit Featured Playlists
              </button>

              <button onClick={() => setPlaylistEditorOpen(true)} className="w-full px-4 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-700 rounded text-left">
                🔄 Update Playlists
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

              <button
                onClick={handleClearGenreCache}
                className="w-full px-4 py-2 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900 dark:hover:bg-yellow-700 rounded text-left"
              >
                🧹 Clear Genre Cache (buggy but stable)
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 🎛 Modals below */}
      <EditFeaturedModal
        isOpen={isEditOpen}
        onClose={() => setEditOpen(false)}
        user_id={user_id}
        onSave={onSave}
      />
      <EditPlaylistsModal isOpen={isPlaylistEditorOpen} onClose={() => setPlaylistEditorOpen(false)} user_id={user_id} />
    </>
  );
}

export default SettingsModal;