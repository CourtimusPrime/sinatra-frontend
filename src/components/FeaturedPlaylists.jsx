// src/components/FeaturedPlaylists.jsx
import React from "react";
import PlaylistCardMini from "./PlaylistCardMini";
import { normalizePlaylist } from "../utils/normalize";

function FeaturedPlaylists({ playlists = [], onSeeAll }) {
  if (!Array.isArray(playlists) || playlists.length === 0) {
    return <p className="text-sm text-gray-500 text-center">No featured playlists available.</p>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-1 font-semibold text-lg leading-none">
          <span className="text-base leading-none">🌟</span>
          <span className="leading-none">Featured Playlists</span>
        </div>
        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="text-sm underline text-blue-600 dark:text-blue-400 leading-none"
          >
            See All →
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {playlists.map((playlist, i) => (
          <PlaylistCardMini
            key={playlist.id || playlist.playlist_id}
            playlist={normalizePlaylist(playlist)}
            index={i}
            showTracks
          />
        ))}
      </div>
    </div>
  );
}

export default FeaturedPlaylists;