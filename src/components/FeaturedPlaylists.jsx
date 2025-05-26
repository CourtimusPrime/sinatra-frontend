// src/components/FeaturedPlaylists.jsx
import React from "react";
import { motion } from "@motionone/react";

function PlaylistCard({ playlist, index = 0 }) {
  if (!playlist || typeof playlist !== "object") {
    return <div className="text-red-500">❌ Playlist not found or invalid</div>;
  }

  const {
    name = "Untitled Playlist",
    image = "/default-playlist.png",
    external_url = `https://open.spotify.com/playlist/${playlist.id || ""}`,
    tracks,
  } = playlist;

  const trackCount = typeof tracks === "number" ? tracks : playlist.track_count ?? "–";

  return (
    <motion.a
      href={external_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 cursor-pointer transition-transform hover:scale-[1.02] hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <img
        src={image}
        alt={name}
        className="w-16 h-16 object-cover rounded-md transition-shadow hover:shadow-md"
      />
      <div className="flex flex-col overflow-hidden">
        <p className="font-bold leading-tight truncate">{name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {typeof trackCount === "number"
            ? `${trackCount} song${trackCount === 1 ? "" : "s"}`
            : "– songs"}
        </p>
      </div>
    </motion.a>
  );
}

export default PlaylistCard;