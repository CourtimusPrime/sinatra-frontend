// src/components/AllPlaylistsModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion/dom";

function AllPlaylistsModal({ isOpen, onClose, playlists }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="modal-container max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold mb-4">All Playlists</h2>
            <div className="flex flex-col gap-3">
              {playlists.map((p) => (
                <a
                  key={p.playlist_id}
                  href={p.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-14 h-14 object-cover rounded"
                  />
                  <div>
                    <p className="font-bold">{p.name}</p>
                    <p className="text-sm text-gray-600">
                      {p.track_count || "–"} songs
                    </p>
                  </div>
                </a>
              ))}
            </div>
            <button onClick={onClose} className="mt-4 text-sm underline">
              Close
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AllPlaylistsModal;
