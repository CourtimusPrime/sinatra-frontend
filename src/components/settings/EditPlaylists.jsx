// src/components/settings/EditPlaylists.jsx
import React, { useState, useEffect } from "react";
import { apiGet, apiPost } from "../../utils/api";
import { motion } from "@motionone/react";

function EditPlaylistsModal({ isOpen, onClose, user_id }) {
  const [tab, setTab] = useState("add");
  const [allSpotifyPlaylists, setAllSpotifyPlaylists] = useState([]);
  const [importedPlaylists, setImportedPlaylists] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    setSelectedIds([]);

    const fetchPlaylists = async () => {
      try {
        const [spotifyRes, mongoRes] = await Promise.all([
          apiGet("/playlists?user_id=" + user_id),
          apiGet("/dashboard?user_id=" + user_id),
        ]);

        const spotifyPlaylists = Array.isArray(spotifyRes.items) ? spotifyRes.items : [];
        const imported = Array.isArray(mongoRes.playlists?.all) ? mongoRes.playlists.all : [];

        setImportedPlaylists(imported);

        if (tab === "add") {
          const importedIds = new Set(imported.map((p) => p.playlist_id || p.id));
          const unimported = spotifyPlaylists.filter((p) => !importedIds.has(p.id));
          setAllSpotifyPlaylists(unimported);
        }
      } catch (err) {
        console.error("❌ Failed to load playlists", err);
        setAllSpotifyPlaylists([]);
        setImportedPlaylists([]);
      }
    };

    fetchPlaylists();
  }, [isOpen, tab]);

  const handleSave = async () => {
    if (tab === "add") {
      const selectedPlaylists = allSpotifyPlaylists.filter((p) => selectedIds.includes(p.id));
      await apiPost("/add-playlists", {
        user_id,
        playlists: selectedPlaylists,
      });
    } else {
      const selectedPlaylists = importedPlaylists.filter((p) =>
        selectedIds.includes(p.playlist_id || p.id)
      );
      await apiPost("/delete-playlists", {
        user_id,
        playlists: selectedPlaylists,
      });
    }

    onClose();
  };

  const playlists = tab === "add" ? allSpotifyPlaylists : importedPlaylists;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        <h2 className="text-lg font-bold mb-4">🔄 {tab === "add" ? "Add Playlists" : "Remove Playlists"}</h2>

        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setTab("add")}
            className={`px-4 py-2 rounded ${tab === "add" ? "bg-green-500 text-white" : "bg-gray-100"}`}
          >
            ➕ Add
          </button>
          <button
            onClick={() => setTab("remove")}
            className={`px-4 py-2 rounded ${tab === "remove" ? "bg-red-500 text-white" : "bg-gray-100"}`}
          >
            ➖ Remove
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 overflow-y-auto pb-24">
          {playlists.length === 0 && (
            <p className="text-sm text-center col-span-2 text-gray-400">
              {tab === "add" ? "No new playlists to add." : "No imported playlists to remove."}
            </p>
          )}
          {playlists.map((p) => {
            const id = p.id || p.playlist_id;
            return (
              <div
                key={id}
                onClick={() =>
                  setSelectedIds((prev) =>
                    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
                  )
                }
                className={`border rounded-lg p-2 text-center cursor-pointer flex flex-col items-center transition ${
                  selectedIds.includes(id)
                    ? "border-blue-500 bg-blue-50"
                    : "hover:bg-gray-100"
                }`}
              >
                <img
                  src={p.image || "/static/default-cover.jpg"}
                  alt={p.name}
                  className="w-20 h-20 object-cover rounded mb-2"
                />
                <p className="text-xs font-medium text-center break-words leading-tight">{p.name}</p>
                <p className="text-[10px] text-gray-500">{p.tracks} songs</p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex justify-between">
          <button onClick={onClose} className="text-sm underline text-gray-500 dark:text-gray-300">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default EditPlaylistsModal;