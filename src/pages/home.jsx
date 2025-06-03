// ✅ CLEANED: src/pages/home.jsx
import React, { useEffect, useState, useRef, lazy, Suspense } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { apiGet, apiDelete } from "../utils/api";
import { normalizePlaylist } from "../utils/normalize";
import { Menu, Share } from "lucide-react";
import GlintBox from "../components/GlintBox";
import UserHeader from "../components/UserHeader";
import PlaylistCardMini from "../components/PlaylistCardMini";
import RecentlyPlayedCard from "../components/RecentlyPlayedCard";
import "../styles/loader.css";
import { motion } from "@motionone/react";

const MusicTaste = lazy(() => import("../components/music/MusicTaste"));
const SettingsModal = lazy(() => import("../components/settings/SettingsModal"));
const AllPlaylistsModal = lazy(() => import("../components/AllPlaylistsModal"));

function Home() {
  const navigate = useNavigate();
  const { user, user_id, loading, setUser } = useUser();
  const [genresData, setGenresData] = useState(null);
  const [track, setTrack] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [isAllModalOpen, setAllModalOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [animateTrackChange, setAnimateTrackChange] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [loading, user]);

  useEffect(() => {
    const cachedUser = localStorage.getItem("user");
    if (!navigator.onLine && cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        setUser(parsed);
        setGenresData(JSON.parse(localStorage.getItem("genres_data") || "{}"));
        setTrack(JSON.parse(localStorage.getItem("last_played_track") || "null"));
        setLastUpdated(new Date(localStorage.getItem("last_played_updated_at")));
        const raw = JSON.parse(localStorage.getItem("featured_playlists") || "[]");
        setPlaylists(Array.isArray(raw) ? raw.map(normalizePlaylist) : []);
        setShowSkeleton(false);
        return;
      } catch (e) {
        console.warn("Failed to load offline cache:", e);
      }
    }
    if (!user) loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const data = await apiGet(`/dashboard`);

      const userData = {
        display_name: data.display_name,
        profile_picture: data.profile_picture,
        genre_analysis: data.genres,
        user_id: data.id,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      if (data.genres) {
        setGenresData(data.genres);
        localStorage.setItem("genres_data", JSON.stringify(data.genres));
      }

      const sortedFeatured = data.playlists?.featured?.map(normalizePlaylist).sort((a, b) => b.tracks - a.tracks) || [];
      setPlaylists(sortedFeatured.slice(0, 3));
      localStorage.setItem("featured_playlists", JSON.stringify(sortedFeatured.slice(0, 3)));
      localStorage.setItem("all_playlists", JSON.stringify(data.playlists?.all?.map(normalizePlaylist) || []));

      if (data.last_played?.track) {
        setTrack(data.last_played.track);
        setLastUpdated(new Date());
        localStorage.setItem("last_played_track", JSON.stringify(data.last_played.track));
        localStorage.setItem("last_played_updated_at", new Date().toISOString());
      }

      setShowSkeleton(false);
    } catch (err) {
      console.error("Dashboard load failed:", err);
    }
  }

  useEffect(() => {
    const nowPlayingInterval = setInterval(loadNowPlaying, 30000);
    const refreshSessionInterval = setInterval(refreshSession, 5 * 60 * 1000);
    return () => {
      clearInterval(nowPlayingInterval);
      clearInterval(refreshSessionInterval);
    };
  }, []);

  async function loadNowPlaying() {
    setIsRefreshing(true);
    try {
      const data = await apiGet(`/playback`);
      const latestTrack = data?.playback?.track;
      if (!latestTrack) return;

      const isSameTrack = JSON.stringify(latestTrack) === JSON.stringify(track);
      if (!isSameTrack) {
        setAnimateTrackChange(true);
        setTrack(latestTrack);
        setLastUpdated(new Date());
        localStorage.setItem("last_played_track", JSON.stringify(latestTrack));
        localStorage.setItem("last_played_updated_at", new Date().toISOString());
        setTimeout(() => setAnimateTrackChange(false), 500);
      }
    } catch (err) {
      console.error("Playback error:", err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  }

  async function refreshSession() {
    try {
      await apiGet(`/refresh-session`);
    } catch {
      localStorage.clear();
      window.location.href = "/";
    }
  }

  function logout() {
    localStorage.clear();
    window.location.href = "/";
  }

  async function deleteAccount() {
    if (!window.confirm("You sure you wanna delete your account?")) return;
    try {
      await apiDelete(`/delete-user`);
      logout();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  if (showSkeleton) {
    return <div className="max-w-md w-full mx-auto p-4 space-y-6"></div>;
  }

  return (
    <div className="max-w-md w-full mx-auto p-4">
      <div className="flex justify-between mb-2">
        {user?.user_id && (
          <button onClick={() => {
            navigator.clipboard.writeText(`https://sinatra.live/u/${user.user_id}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}>
            {copied ? <span className="text-xs font-semibold">✅</span> : <Share className="w-5 h-5" />}
          </button>
        )}
        <button onClick={() => setSettingsOpen(true)}><Menu className="w-5 h-5" /></button>
      </div>

      <UserHeader user={user} genresData={genresData} />
      {track && (
        <div className={`transition-transform duration-300 scale-100 ${animateTrackChange ? "animate-scalein" : ""}`}>
          <RecentlyPlayedCard
            track={track}
            lastUpdated={lastUpdated}
            onRefresh={loadNowPlaying}
            animateChange={animateTrackChange}
            isRefreshing={isRefreshing}
          />
        </div>
      )}

      <Suspense fallback={<div className="text-center text-sm text-gray-400">Loading music taste...</div>}>
        <MusicTaste genresData={user?.genre_analysis} userId={user?.user_id} />
      </Suspense>

      <motion.div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 mt-3">
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold text-lg flex items-center gap-1">
            <span>🌟</span> Featured Playlists
          </div>
          <button onClick={() => setAllModalOpen(true)} className="underline">See All →</button>
        </div>
        <div className="flex flex-col gap-3">
          {playlists.map((playlist, i) => (
            <PlaylistCardMini key={playlist.id || i} playlist={playlist} index={i} showTracks />
          ))}
        </div>
      </motion.div>

      <Suspense fallback={null}>
        {isAllModalOpen && <AllPlaylistsModal isOpen={true} onClose={() => setAllModalOpen(false)} user={user} />}
        {isSettingsOpen && <SettingsModal isOpen={true} onClose={() => setSettingsOpen(false)} onLogout={logout} onDelete={deleteAccount} onSave={loadDashboard} user={user} />}
      </Suspense>
    </div>
  );
}

export default Home;