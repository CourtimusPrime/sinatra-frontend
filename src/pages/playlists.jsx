// src/pages/playlist.jsx
import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { apiGet } from "../utils/api";

function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const { user_id, importantPlaylists, loading } = useUser();

  useEffect(() => {
    if (!user_id) {
      window.location.href = "/";
      return;
    }

    if (importantPlaylists.length === 0) return;

    Promise.all(
      importantPlaylists.map((pid) =>
        apiGet(`/public-playlist/${pid}`)
      )
    ).then(setPlaylists)
     .catch((err) => {
       console.error("Failed to load public playlists:", err);
     });
  }, [user_id, importantPlaylists]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Playlists</h1>

      {playlists.length === 0 ? (
        <p className="text-gray-500 text-center">No featured playlists yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {playlists.map((playlist, idx) => (
            <div
              key={idx}
              onClick={() =>
                window.open(
                  playlist.tracks?.[0]?.external_url ||
                    `https://open.spotify.com/playlist/${playlist.playlist_id}`,
                  "_blank"
                )
              }
              className="cursor-pointer border rounded-lg p-2 text-center hover:shadow"
            >
              <img
                src={playlist.image || "/static/default-cover.jpg"}
                alt={playlist.name}
                className="w-full h-24 object-cover rounded mb-2"
              />
              <p className="text-sm font-medium truncate">{playlist.name}</p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => (window.location.href = "/home")}
        className="text-blue-600 underline"
      >
        ← Back to Home
      </button>
    </div>
  );
}

export default Playlists;