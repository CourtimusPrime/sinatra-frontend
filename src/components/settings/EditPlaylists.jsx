// src/components/settings/EditPlaylists.jsx
import React, { useState, useEffect } from "react";
import { apiGet, apiPost } from "../../utils/api";
import { motion } from "@motionone/react";
import "../../styles/loader.css";
import GlintBox from "../GlintBox";
import PlaylistCardMini from "../PlaylistCardMini";
import { normalizePlaylist } from "../../utils/normalize";

function EditPlaylistsModal({ isOpen, onClose, user_id }) {
  const [tab, setTab] = useState("add");
  const [allSpotifyPlaylists, setAllSpotifyPlaylists] = useState([]);
  const [importedPlaylists, setImportedPlaylists] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!isOpen) return;

    const fetchPlaylists = async () => {
      setLoading(true);
      setSelectedIds([]);
      setError(null);

      try {
        const [spotifyRes, mongoRes] = await Promise.all([
          apiGet("/playlists?user_id=" + user_id),
          apiGet("/dashboard?user_id=" + user_id),
        ]);

        const spotifyPlaylistsRaw = Array.isArray(spotifyRes.items) ? spotifyRes.items : [];
        const mongoPlaylistsRaw = Array.isArray(mongoRes.playlists?.all) ? mongoRes.playlists.all : [];

        const spotifyPlaylists = spotifyPlaylistsRaw.map(normalizePlaylist);
        const imported = mongoPlaylistsRaw.map(normalizePlaylist);

        setImportedPlaylists(imported);

        const importedIds = new Set(imported.map((p) => p.playlist_id));
        const unimported = spotifyPlaylists.filter(
          (p) => !importedIds.has(p.playlist_id) && typeof p.image === "string" && p.image.trim() !== ""
        );
        setAllSpotifyPlaylists(unimported);
      } catch (err) {
        console.error("❌ Failed to load playlists", err);
        setError("Failed to load playlists.");
        setAllSpotifyPlaylists([]);
        setImportedPlaylists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [isOpen, user_id]);

  const handleSave = async () => {
    setError(null);
    setLoading(true);

    try {
      if (tab === "add") {
        const selectedPlaylists = allSpotifyPlaylists
          .filter((p) => selectedIds.includes(p.playlist_id))
          .map((p) => ({
            id: p.playlist_id,
            name: p.name,
            image: p.image,
            tracks: p.tracks,
          }));

        await apiPost("/add-playlists", {
          user_id,
          playlists: selectedPlaylists,
        });
      } else {
        const selectedPlaylists = importedPlaylists.filter((p) =>
          selectedIds.includes(p.playlist_id)
        );
        await apiPost("/delete-playlists", {
          user_id,
          playlists: selectedPlaylists,
        });
      }
      onClose();
    } catch (err) {
      console.error("❌ Save failed:", err);
      setError("Failed to save your changes.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const playlists = tab === "add" ? allSpotifyPlaylists : importedPlaylists;

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

        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

        <div className="grid grid-cols-2 gap-3 overflow-y-auto pb-24">
        {loading ? (
          [...Array(8)].map((_, i) => (
            <div
              key={i}
              className="border rounded-lg p-2 text-center flex flex-col items-center animate-pulse"
            >
              <GlintBox width="w-20" height="h-20" rounded="rounded" />
              <GlintBox width="w-4/5" height="h-3" className="mt-2" />
              <GlintBox width="w-2/5" height="h-2" className="mt-1" />
            </div>
          ))
        ) : playlists.length === 0 ? (
          <p className="text-sm text-center col-span-2 text-gray-400">
            {tab === "add" ? "No new playlists to add." : "No imported playlists to remove."}
          </p>
        ) : (
          playlists.map((p) => {
            const id = p.playlist_id || p.id;
            return (
              <PlaylistCardMini
                key={id}
                playlist={p}
                onClick={() =>
                  setSelectedIds((prev) =>
                    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
                  )
                }
                isSelected={selectedIds.includes(id)}
                selectable
                showTracks
              />
            );
          })
        )}
      </div>

        <div className="mt-4 flex justify-between">
          <button onClick={onClose} className="text-sm underline text-gray-500 dark:text-gray-300">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || selectedIds.length === 0}
            className={`px-4 py-2 rounded text-white ${
              tab === "add"
                ? "bg-green-500"
                : "bg-red-500"
            } ${loading ? "opacity-50 cursor-wait" : ""}`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default EditPlaylistsModal;