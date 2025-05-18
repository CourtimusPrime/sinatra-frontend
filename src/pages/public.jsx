// src/pages/Public.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RecentlyPlayedCard from "../components/RecentlyPlayedCard";
import PlaylistCard from "../components/PlaylistCard";
import MusicTaste from "../components/ui/MusicTaste";
import TopSubGenre from "../components/ui/TopSubGenre";
import { apiGet } from "../utils/api";
import Loader from "../components/Loader";

export default function PublicProfile() {
  const { user_id } = useParams();
  const [profile, setProfile] = useState(null);
  const [genreMap, setGenreMap] = useState({});

  useEffect(() => {
    async function load() {
      try {
        const [userData, map] = await Promise.all([
          apiGet(`/public-profile/${user_id}`),
          apiGet(`/genre-map`)
        ]);
        setProfile(userData);
        setGenreMap(
          Object.fromEntries(
            Object.entries(map).map(([k, v]) => [k.toLowerCase(), v.toLowerCase()])
          )
        );
      } catch (err) {
        console.error("❌ Failed to load public profile or genre map:", err);
      }
    }
    load();
  }, [user_id]);

  if (!profile) return <Loader />;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* 1. Profile */}
      <div className="flex items-center gap-4">
        <img src={profile.profile_picture} className="w-20 h-20 rounded-full" />
        <div>
          <h1 className="text-2xl font-bold">
            {profile.display_name || `/u/${profile.user_id}`}
          </h1>
          <TopSubGenre genresData={profile.genres_data} />
        </div>
      </div>

      {/* 2. Recently Played */}
      {profile.last_played_track && (
        <RecentlyPlayedCard
          track={profile.last_played_track?.track || profile.last_played_track}
        />
      )}

      {/* 3. Music Taste */}
      <div className="mt-8">
        <MusicTaste genresData={profile.genres_data} genreMap={genreMap} />
      </div>

      {/* 4. Featured Playlists */}
      <div className="my-6">
        <h2 className="text-xl font-semibold mb-2">🌟 Featured Playlists</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profile.featured_playlists.map((playlist, idx) => (
            <PlaylistCard key={idx} playlist={playlist} />
          ))}
        </div>
      </div>
    </div>
  );
}