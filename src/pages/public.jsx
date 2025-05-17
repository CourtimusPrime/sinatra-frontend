// src/pages/public.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaylistCard from "../components/PlaylistCard";
import RecentlyPlayedCard from "../components/RecentlyPlayedCard";
import MusicTaste from "../components/ui/MusicTaste";
import TopSubGenre from "../components/ui/TopSubGenre";
import "../styles/loader.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function PublicView() {
  const { user_id } = useParams();

  const [user, setUser] = useState(null);
  const [track, setTrack] = useState(null);
  const [genresData, setGenresData] = useState(null);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (!user_id) return;

    fetch(`${API_BASE}/dashboard?user_id=${user_id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser({
          display_name: data.user.display_name,
          user_id: user_id,
          profile_picture: data.user.profile_picture,
        });
        setTrack(data.last_played_track?.track || null);
        setGenresData(data.user.genre_analysis || {});
        setPlaylists(data.playlists.featured || []);
      })
      .catch(console.error);
  }, [user_id]);

  if (!user_id) return <p>No user ID provided.</p>;
  if (!user) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto p-4">
      <img src={user.profile_picture} className="w-24 h-24 rounded-full mx-auto" />
      <h1 className="text-2xl font-bold text-center mt-2">{user.display_name}</h1>
      <p className="text-center text-gray-500">@{user.user_id}</p>

      <TopSubGenre genresData={genresData} />

      {track && (
        <div className="mt-4">
          <RecentlyPlayedCard track={track} />
        </div>
      )}

      <MusicTaste genresData={genresData} />

      <div className="mt-6">
        <h2 className="font-semibold text-lg mb-2">🌟 Featured Playlists</h2>
        <div className="flex flex-col gap-3">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.playlist_id} playlist={playlist} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PublicView;