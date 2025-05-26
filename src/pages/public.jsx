// src/pages/public.jsx
import React, { useEffect, useState, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import RecentlyPlayedCard from "../components/RecentlyPlayedCard";
import PlaylistCardMini from "../components/PlaylistCardMini";
import { normalizePlaylist } from "../utils/normalize";
import { apiGet } from "../utils/api";
import Loader from "../components/Loader";
import { motion } from "@motionone/react";
import { Share } from "lucide-react";
const AllPlaylistsModal = lazy(() => import("../components/AllPlaylistsModal"));
import Spotify from "../assets/spotify.svg";

// Lazy-loaded components
const MusicTaste = lazy(() => import("../components/music/MusicTaste"));
const TopSubGenre = lazy(() => import("../components/ui/TopSubGenre"));

export default function PublicProfile() {
  const { user_id } = useParams();
  const [profile, setProfile] = useState(null);
  const [genreMap, setGenreMap] = useState({});
  const [showCTA, setShowCTA] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAllModalOpen, setAllModalOpen] = useState(false);
  const handleLogin = () => {
    const target = import.meta.env.VITE_API_BASE_URL + "/login";
    console.log("🛩️ Redirecting to:", target);
    window.location.href = target;
  };

  useEffect(() => {
    async function load() {
      try {
        const [userData, map] = await Promise.all([
          apiGet(`/public-profile/${user_id}`),
          apiGet(`/genre-map`),
        ]);

        console.log("🎯 Public profile loaded:", userData); // ADD THIS

        setProfile({
          ...userData,
          featured_playlists: Array.isArray(userData.featured_playlists)
            ? userData.featured_playlists.map(normalizePlaylist)
            : [],
        });
        setGenreMap(
          Object.fromEntries(
            Object.entries(map).map(([k, v]) => [k.toLowerCase(), v.toLowerCase()])
          )
        );
        setTimeout(() => setShowCTA(true), 1500);
      } catch (err) {
        console.error("❌ Failed to load public profile or genre map:", err);
      }
    }
    load();
  }, [user_id]);

  if (!profile) return <Loader />;

  const {
    display_name,
    profile_picture,
    genres_data,
    last_played_track,
    featured_playlists,
  } = profile;

  return (
    <div className="max-w-md w-full mx-auto p-4">
      {/* 🔗 Top row - share button only */}
      <div className="flex justify-end mb-2">
        <button
          onClick={() => {
            const profileUrl = `https://sinatra.live/u/${user_id}`;
            navigator.clipboard.writeText(profileUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          aria-label="Copy profile link"
          className="text-black dark:text-white hover:opacity-60 transition"
        >
          {copied ? (
            <span className="text-xs font-semibold">✅</span>
          ) : (
            <Share className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* 👤 Profile picture + name */}
      <motion.div
        className="flex flex-col items-center my-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.img
          src={profile_picture || ""}
          alt="Profile"
          className="w-24 h-24 object-cover rounded-full mb-2"
          loading="lazy"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        <motion.h1
          className="text-2xl font-bold text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {display_name || "Unknown User"}
        </motion.h1>

        <motion.a
          href={`https://open.spotify.com/user/${user_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg text-gray-500 dark:text-gray-300 font-bold text-center block"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          @{user_id}
        </motion.a>
      </motion.div>

      <Suspense fallback={null}>
        {genres_data && <TopSubGenre genresData={genres_data} />}
      </Suspense>

      {last_played_track && (
        <RecentlyPlayedCard track={last_played_track?.track || last_played_track} />
      )}

      <Suspense fallback={<div className="text-center text-sm text-gray-400">Loading music taste...</div>}>
        {genres_data && genreMap && (
          <MusicTaste
            key={user_id + "_taste"}
            genresData={genres_data}
            genreMap={genreMap}
          />
        )}
      </Suspense>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 mt-6"
      >
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold text-lg flex items-center gap-1">
            <span>🌟</span> Featured Playlists
          </div>
          <button
            aria-label="Open all user's playlists"
            onClick={() => setAllModalOpen(true)}
            className="underline text-sm text-blue-600 dark:text-blue-400"
          >
            See All →
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {Array.isArray(featured_playlists) && featured_playlists.length > 0 ? (
            featured_playlists.map((playlist, i) =>
              playlist && typeof playlist === "object" ? (
                <PlaylistCardMini key={playlist.id || i} playlist={playlist} index={i} showTracks />
              ) : (
                <div key={i} className="text-red-500 text-sm">
                  ⚠️ Skipped invalid playlist
                </div>
              )
            )
          ) : (
            <div className="text-gray-500 text-sm text-center">No featured playlists found.</div>
          )}
        </div>
      </motion.div>

      <div className="fixed bottom-0 left-0 w-full sm:hidden z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 shadow-md">
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white text-base font-medium transition"
        >
          <img src={Spotify} alt="Spotify logo" className="w-5 h-5" />
          Create Your Own →
        </button>
      </div>
      <div className="h-20 sm:hidden" />
      <Suspense fallback={null}>
        {isAllModalOpen && (
          <AllPlaylistsModal
            isOpen={isAllModalOpen}
            onClose={() => setAllModalOpen(false)}
            user_id={user_id}
            user={profile}
          />
        )}
      </Suspense>
    </div>
  );
}