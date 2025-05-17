// src/pages/home.jsx
import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import PlaylistCard from "../components/PlaylistCard";
import { useNavigate } from "react-router-dom";
import "../styles/loader.css";
import SettingsModal from "../components/settings/SettingsModal";
import RecentlyPlayedCard from "../components/RecentlyPlayedCard";
import AllPlaylistsModal from "../components/AllPlaylistsModal";
import { motion } from "@motionone/react";
import MusicTaste from "../components/ui/MusicTaste";
import TopSubGenre from "../components/ui/TopSubGenre";
import { apiGet, apiDelete } from "../utils/api";

function Home() {
  const [genresData, setGenresData] = useState(null);
  const [genreMap, setGenreMap] = useState({});
  const [isAllModalOpen, setAllModalOpen] = useState(false);
  const [allPlaylists, setAllPlaylists] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [animateTrackChange, setAnimateTrackChange] = useState(false);
  const { user, user_id, loading, setUser } = useUser();
  const [hasAnimatedInitialLoad, setHasAnimatedInitialLoad] = useState(false);
  const [track, setTrack] = useState(() => {
    const cached = localStorage.getItem("last_played_track");
    return cached ? JSON.parse(cached) : null;
  });
  const [playlists, setPlaylists] = useState([]);
  const navigate = useNavigate();
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(() => {
    const cached = localStorage.getItem("last_played_updated_at");
    return cached ? new Date(cached) : null;
  });

  useEffect(() => {
    if (!user_id) return;
    loadDashboard();
  }, [user_id]);

  async function loadDashboard() {
    if (!user_id) return;
    try {
      const json = await apiGet(`/dashboard?user_id=${user_id}`);

      setUser({
        display_name: json.user.display_name,
        profile_picture: json.user.profile_picture,
        genreAnalysis: json.user.genre_analysis,
      });

      const sortedFeatured = json.playlists.featured.sort((a, b) => (b.track_count || 0) - (a.track_count || 0));
      const sortedAll = json.playlists.all.sort((a, b) => (b.track_count || 0) - (a.track_count || 0));
      setPlaylists(sortedFeatured.slice(0, 3));
      setAllPlaylists(sortedAll);

      const latestTrack = json.last_played_track?.track;
      if (latestTrack) {
        setTrack(latestTrack);
        setLastUpdated(new Date());
        localStorage.setItem("last_played_track", JSON.stringify(latestTrack));
        localStorage.setItem("last_played_updated_at", new Date().toISOString());
      }
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    }
  }

  useEffect(() => {
    if (!user_id) return;

    const nowPlayingInterval = setInterval(loadNowPlaying, 30000);
    const refreshSessionInterval = setInterval(refreshSession, 5 * 60 * 1000);

    return () => {
      clearInterval(nowPlayingInterval);
      clearInterval(refreshSessionInterval);
    };
  }, [user_id]);

  useEffect(() => {
    const fetchMap = async () => {
      try {
        const res = await apiGet("/genre-map");
        const json = await res.json();
        const normalized = Object.fromEntries(
          Object.entries(json).map(([k, v]) => [k.toLowerCase(), v.toLowerCase()])
        );
        setGenreMap(normalized);
      } catch (err) {
        console.error("Failed to fetch genre map:", err);
      }
    };

    fetchMap();
  }, []);

  useEffect(() => {
    if (!user_id || genresData) return;

    const controller = new AbortController();

    async function fetchGenresIfNeeded() {
      if (user?.genreAnalysis) {
        console.log("✅ setGenresData from user", user.genreAnalysis);
        setGenresData(user.genreAnalysis);
      } else {
        try {
          const data = await apiGet(`/genres?user_id=${user_id}`);
          console.log("✅ setGenresData from fetch", data);
          setGenresData(data);
        } catch (err) {
          if (controller.signal.aborted) return;
          console.error("Failed to fetch /genres:", err);
        }
      }
    }

    fetchGenresIfNeeded();

    return () => controller.abort();
  }, [user_id, user, genresData]);

  async function loadNowPlaying() {
    setIsRefreshing(true);
    try {
      const data = await apiGet(`/playback?user_id=${user_id}`);
      const latestTrack = data.playback?.track;

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
      await apiGet(`/refresh-session?user_id=${user_id}`);
    } catch {
      logout();
    }
  }

  function logout() {
    localStorage.clear();
    window.location.href = "/";
  }

  async function deleteAccount() {
    if (!window.confirm("You sure you wanna delete your account? You'll be able to start again.")) return;
    try {
      await apiDelete(`/delete-user?user_id=${user_id}`);
      logout();
    } catch (err) {
      console.error("Failed to delete account:", err);
    }
  }

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto p-4">
      <button
        onClick={() => setSettingsOpen(true)}
        className="text-sm underline text-right block ml-auto"
      >
        ⚙️ Settings
      </button>

      <motion.div
        className="flex flex-col items-center my-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.img
          src={user?.profile_picture || ""}
          alt="Profile"
          className="w-24 h-24 object-cover rounded-full mb-2"
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
          {user?.display_name || "Sgt. Pepper"}
        </motion.h1>

        <motion.a
          href={`https://open.spotify.com/user/${user?.user_id || ""}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg text-gray-500 font-bold text-center block"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {"@" + user?.user_id || ""}
        </motion.a>
      </motion.div>

      <TopSubGenre genresData={genresData} />

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
      
      {console.log("✅ MusicTaste genresData:", genresData)}
      <MusicTaste genresData={genresData} genreMap={genreMap} />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        className="bg-white rounded-2xl shadow p-4 mt-6"
      >
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold text-lg flex items-center gap-1">
            <span>🌟</span> Featured Playlists
          </div>
          <button onClick={() => setAllModalOpen(true)} className="mt-4 underline">
            See All →
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {playlists.map((playlist, idx) => (
            <PlaylistCard key={playlist.id || idx} playlist={playlist} index={idx} />
          ))}
        </div>
      </motion.div>

      <AllPlaylistsModal
        isOpen={isAllModalOpen}
        onClose={() => setAllModalOpen(false)}
        playlists={allPlaylists}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        onLogout={logout}
        onDelete={deleteAccount}
        user_id={user_id}
        onSave={loadDashboard}
      />
    </div>
  );
}

export default Home;