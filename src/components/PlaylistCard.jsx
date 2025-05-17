// src/components/PlaylistCard.jsx
import React from "react";
import { motion } from "@motionone/react";

function PlaylistCard({ playlist }) {
  return (
    <motion.a
      href={playlist.external_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 cursor-pointer transition-transform hover:scale-[1.02] hover:bg-gray-100 p-2 rounded-md"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <img
        src={playlist.image}
        alt={playlist.name}
        className="w-16 h-16 object-cover rounded-md transition-shadow hover:shadow-md"
      />
      <div className="flex flex-col">
        <p className="font-bold leading-tight">{playlist.name}</p>
        <p className="text-sm text-gray-600">
          {playlist.track_count || "–"} songs
        </p>
      </div>
    </motion.a>
  );
}

export default PlaylistCard;