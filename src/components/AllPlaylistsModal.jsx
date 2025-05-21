// src/components/AllPlaylistsModal.jsx
import React, { useEffect, useState } from "react";
import { motion } from "@motionone/react";
import { apiGet } from "../utils/api";

function AllPlaylistsModal({ isOpen, onClose, user_id }) {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [allPlaylists, setAllPlaylists] = useState([]);

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
    try {
      const res = await apiGet(`/dashboard?user_id=${user_id}`);
      const playlists = res?.playlists?.all || [];
      setAllPlaylists(playlists);
    } catch (err) {
      console.error("❌ Failed to fetch all playlists", err);
      setAllPlaylists([]);
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
        <h2 className="text-xl font-bold mb-4 text-center">All Imported Playlists</h2>
        <div className="flex flex-col gap-3">
          {allPlaylists.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">No playlists found.</p>
          ) : (
            allPlaylists.map((p) => (
              <a
                key={p.playlist_id}
                href={p.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-14 h-14 object-cover rounded"
                />
                <div>
                  <p className="font-bold text-sm">{p.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {p.track_count || "–"} songs
                  </p>
                </div>
              </a>
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