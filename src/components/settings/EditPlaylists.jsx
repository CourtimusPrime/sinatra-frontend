// src/components/settings/EditPlaylists.jsx
import React, { useState, useEffect } from "react";
import { apiGet, apiPost } from "../../utils/api";
import { motion } from "@motionone/react";
import "../../styles/loader.css";
import GlintBox from "../GlintBox";
import PlaylistCardMini from "../PlaylistCardMini";
import { normalizePlaylist } from "../../utils/normalize";
import CloseButton from "../ui/CloseButton";
import { useUser } from "../../context/UserContext";

function EditPlaylistsModal({ isOpen, onClose }) {
  const { user_id } = useUser();
  const [tab, setTab] = useState("add");
  const [allSpotifyPlaylists, setAllSpotifyPlaylists] = useState([]);
  const [importedPlaylists, setImportedPlaylists] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortDesc, setSortDesc] = useState(true);

  const handleRefresh = async () => {
      setLoading(true);
      setError(null);

      try {
        await apiPost("/admin/sync_playlists", {}); // triggers backend sync
        const [syncedRes, dashboardRes] = await Promise.all([
          apiGet("/synced-playlists"),
          apiGet("/dashboard"),
        ]);

        const syncedPlaylistsRaw = Array.isArray(syncedRes.playlists)
          ? syncedRes.playlists
          : [];

        const mongoPlaylistsRaw = Array.isArray(dashboardRes.playlists?.all)
          ? dashboardRes.playlists.all
          : [];

        const imported = mongoPlaylistsRaw.map(normalizePlaylist);
        setImportedPlaylists(imported);

        const importedIds = new Set(imported.map((p) => p.playlist_id));
        const all = syncedPlaylistsRaw.map(normalizePlaylist);

        const unimported = all.filter(
          (p) =>
            !importedIds.has(p.playlist_id) &&
            typeof p.image === "string" &&
            p.image.trim() !== ""
        );

        setAllSpotifyPlaylists(unimported);
      } catch (err) {
        console.error("❌ Refresh failed", err);
        setError("Failed to refresh playlists.");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (!isOpen) return;

    const fetchPlaylists = async () => {
      setLoading(true);
      setSelectedIds([]);
      setError(null);

      try {
        const [syncedRes, dashboardRes] = await Promise.all([
          apiGet("/synced-playlists"),
          apiGet("/dashboard"),
        ]);

        const syncedPlaylistsRaw = Array.isArray(syncedRes.playlists)
          ? syncedRes.playlists
          : [];

        const mongoPlaylistsRaw = Array.isArray(dashboardRes.playlists?.all)
          ? dashboardRes.playlists.all
          : [];

        const imported = mongoPlaylistsRaw.map(normalizePlaylist);
        setImportedPlaylists(imported);

        const importedIds = new Set(imported.map((p) => p.playlist_id));
        const all = syncedPlaylistsRaw.map(normalizePlaylist);

        const unimported = all.filter(
          (p) =>
            !importedIds.has(p.playlist_id) &&
            typeof p.image === "string" &&
            p.image.trim() !== ""
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
          .filter((p) => {
            const id = p.playlist_id || p.id;
            return selectedIds.includes(id);
          })
          .sort((a, b) => (b.tracks || 0) - (a.tracks || 0))
          .map((p) => {
            const id = p.playlist_id || p.id;
            return { id };
          });

        console.log("Sending to /add-playlists:", selectedPlaylists);
        await apiPost("/add-playlists", {
          user_id,
          playlists: selectedPlaylists,
        });
      } else {
        const selectedPlaylists = allSpotifyPlaylists
          .filter((p) => selectedIds.includes(p.playlist_id))
          .map((p) => ({ id: p.playlist_id }));
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

  const playlists = tab === "add" ? importedPlaylists : allSpotifyPlaylists;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        <div className="mb-4 space-y-2">
          <h2 className="text-lg font-bold">🔄 {tab === "add" ? "Add Playlists" : "Remove Playlists"}</h2>

          {tab === "add" && (
            <div className="flex gap-2">
              <input
                className="flex-1 p-2 border rounded dark:bg-gray-700 dark:text-white"
                placeholder="Search playlists..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                onClick={() => setSortDesc((prev) => !prev)}
                className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-sm"
              >
                Sort {sortDesc ? "↓" : "↑"}
              </button>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-3 py-2 rounded bg-blue-100 dark:bg-blue-700 text-sm text-blue-800 dark:text-white"
              >
                🔄 Refresh from Spotify
              </button>
            </div>
          )}
        </div>

        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setTab("add")}
            className={`px-4 py-2 rounded ${
              tab === "add"
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
            }`}
          >
            ➕ Add
          </button>
          <button
            onClick={() => setTab("remove")}
            className={`px-4 py-2 rounded ${
              tab === "remove"
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
            }`}
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
              className="flex items-center gap-4 cursor-pointer bg-white dark:bg-gray-900 p-2 rounded-md animate-pulse border"
            >
              <GlintBox width="w-14" height="h-14" rounded="rounded-md" />
              <div className="flex flex-col gap-2 flex-1">
                <GlintBox width="w-3/4" height="h-4" />
                <GlintBox width="w-1/2" height="h-3" />
              </div>
            </div>
          ))
        ) : playlists.length === 0 ? (
          <p className="text-sm text-center col-span-2 text-gray-400">
            {tab === "add" ? "No new playlists to add." : "No imported playlists to remove."}
          </p>
        ) : (
          (() => {
            const seen = new Set();
            return [...playlists]
              .filter((p) => {
                const id = p.playlist_id || p.id;
                if (!id || seen.has(id)) return false;
                seen.add(id);
                return p.name.toLowerCase().includes(search.toLowerCase());
              })
              .sort((a, b) =>
                sortDesc
                  ? (b.tracks || 0) - (a.tracks || 0)
                  : (a.tracks || 0) - (b.tracks || 0)
              )
              .map((p, i) => {
                const id = p.playlist_id || p.id;
                return (
                  <PlaylistCardMini
                    key={id}
                    playlist={p}
                    index={i}
                    onClick={() =>
                      setSelectedIds((prev) =>
                        prev.includes(id)
                          ? prev.filter((i) => i !== id)
                          : [...prev, id]
                      )
                    }
                    isSelected={selectedIds.includes(id)}
                    selectable
                    showTracks
                  />
                );
              });
          })()
        )}
      </div>

        <div className="sticky bottom-0 left-0 bg-white dark:bg-gray-800 border-t mt-4 pt-3 pb-4 px-6 flex gap-2 z-10">
          <CloseButton onClick={onClose} className="flex-1" />
          <button
            onClick={handleSave}
            disabled={loading || selectedIds.length === 0}
            className={`flex-1 px-4 py-2 rounded text-white ${
              tab === "add" ? "bg-green-500" : "bg-red-500"
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