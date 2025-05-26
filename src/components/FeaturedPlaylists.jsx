// src/components/FeaturedPlaylists.jsx
import React from "react";
import PlaylistCardMini from "./PlaylistCardMini";
import { normalizePlaylist } from "../utils/normalize"; // optional if not normalized yet

function FeaturedPlaylists({ playlists = [] }) {
  if (!Array.isArray(playlists) || playlists.length === 0) {
    return <p className="text-sm text-gray-500 text-center">No featured playlists available.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {playlists.map((playlist, i) => (
        <PlaylistCardMini
          key={playlist.id || playlist.playlist_id}
          playlist={normalizePlaylist(playlist)} // optional if not already normalized
          index={i}
          showTracks
        />
      ))}
    </div>
  );
}

export default FeaturedPlaylists;