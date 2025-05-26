// src/components/AllPlaylistsModal.jsx
import React, { useEffect, useState } from "react";
import { motion } from "@motionone/react";
import { apiGet } from "../utils/api";
import GlintBox from "./GlintBox";
import PlaylistCardMini from "./PlaylistCardMini";
import { normalizePlaylist } from "../utils/normalize";

function AllPlaylistsModal({ isOpen, onClose, user_id, user }) {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [allPlaylists, setAllPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timer;
    if (isOpen) {
      setIsVisible(true);
      fetchPlaylists();
    } else {
      timer = setTimeout(() => setIsVisible(false), 250); // match transition
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const res = await apiGet(`/dashboard?user_id=${user_id}`);
      const raw = res?.playlists?.all || [];
      setAllPlaylists(raw.map(normalizePlaylist));
    } catch (err) {
      console.error("❌ Failed to fetch all playlists", err);
      setAllPlaylists([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isOpen ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="modal-container max-w-md w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4 text-center">📚 {user?.display_name || "Your"}'s Collection</h2>
        <div className="flex flex-col gap-3">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded animate-pulse">
                <GlintBox width="w-14" height="h-14" rounded="rounded" />
                <div className="flex flex-col gap-2 flex-1">
                  <GlintBox width="w-3/4" height="h-4" />
                  <GlintBox width="w-1/2" height="h-3" />
                </div>
              </div>
            ))
          ) : allPlaylists.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">No playlists found.</p>
          ) : (
            allPlaylists.map((p, i) => (
              <PlaylistCardMini key={p.id || p.playlist_id} playlist={p} index={i} showTracks />
            ))
          )}
        </div>
        <button
          aria-label="Close modal"
          onClick={onClose}
          className="mt-4 text-sm underline text-gray-600 dark:text-gray-300"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
}

export default AllPlaylistsModal;