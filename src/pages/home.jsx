// src/pages/home.jsx
import React, { useEffect, useState, useRef, lazy, Suspense } from "react";
import { useUser } from "../context/UserContext";
import PlaylistCardMini from "../components/PlaylistCardMini";
import { useNavigate } from "react-router-dom";
import "../styles/loader.css";
import RecentlyPlayedCard from "../components/RecentlyPlayedCard";
import { motion } from "@motionone/react";
import { apiGet, apiDelete } from "../utils/api";
import { Menu, Share } from "lucide-react";
import { normalizePlaylist } from "../utils/normalize";
import GlintBox from "../components/GlintBox";

// Lazy-loaded components
const MusicTaste = lazy(() => import("../components/music/MusicTaste"));
const TopSubGenre = lazy(() => import("../components/ui/TopSubGenre"));
const SettingsModal = lazy(() => import("../components/settings/SettingsModal"));
const AllPlaylistsModal = lazy(() => import("../components/AllPlaylistsModal"));

function Home() {
  const loadStart = useRef(performance.now());
  const didInit = useRef(false);
  
  const getCached = (key, fallback) => {
    try {
      const cached = localStorage.getItem(key);
      return cached ? JSON.parse(cached) : fallback;
    } catch {
      return fallback;
    }
  };

  const [userState, setUserState] = useState(() => getCached("user", null));
  const [copied, setCopied] = useState(false);
  const [genresData, setGenresData] = useState(() => getCached("genres_data", null));
  const [track, setTrack] = useState(() => getCached("last_played_track", null));
  const [lastUpdated, setLastUpdated] = useState(() => {
    const cached = localStorage.getItem("last_played_updated_at");
    return cached ? new Date(cached) : null;
  });

  const rawFeatured = getCached("featured_playlists", []);
  const validFeatured = Array.isArray(rawFeatured) ? rawFeatured.map(normalizePlaylist) : [];
  const [playlists, setPlaylists] = useState(validFeatured);
  const [allPlaylists, setAllPlaylists] = useState(() => getCached("all_playlists", []));
  const [genreMap, setGenreMap] = useState(() => getCached("genre_map", {}));
  const [lastInit, setLastInit] = useState(() => {
    const cached = localStorage.getItem("last_init_home");
    return cached ? new Date(cached) : null;
  });

  const [loadTime, setLoadTime] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [animateTrackChange, setAnimateTrackChange] = useState(false);
  const [isAllModalOpen, setAllModalOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const { user, user_id, loading, setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user_id) {
      navigate("/", { replace: true });
      return;
    }

    apiGet(`/me?user_id=${user_id}`)
      .then((data) => {
        if (!data?.registered) {
          console.warn("You haven't registered yet, let's get you set up...");
          navigate("/", { replace: true });
        }
      })
      .catch((err) => {
        console.error("⛔ Error during user verification:", err);
        navigate("/", { replace: true });
      });
  }, [user_id]);

  useEffect(() => {
    if (!user_id || didInit.current) return;
    didInit.current = true;

    const runIdle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

    runIdle(() => {
      const now = new Date();
      const shouldUpdate = !lastInit || now - new Date(lastInit) > 60 * 60 * 1000;
      if (shouldUpdate) loadDashboard();
    });
  }, [user_id]);

  useEffect(() => {
    if (userState && playlists.length > 0) {
      setShowSkeleton(false);
    }
  }, [userState, playlists]);

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.debug("[dev] showSkeleton check:", { userState, playlists });
    }
  }, [userState, playlists]);

  async function loadDashboard() {
    if (!user_id) return;

    try {
      const json = await apiGet(`/dashboard?user_id=${user_id}`);
      const { user, playlists, played_track, genre_map } = json;

      const userData = {
        display_name: user.display_name,
        profile_picture: user.profile_picture,
        genre_analysis: user.genre_analysis,
        user_id: user.user_id,
      };

      setUser(userData);
      setUserState(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      if (user.genre_analysis) {
        setGenresData(user.genre_analysis);
        localStorage.setItem("genres_data", JSON.stringify(user.genre_analysis));
      }

      const sortedFeatured = playlists.featured.map(normalizePlaylist).sort((a, b) => b.tracks - a.tracks);
      const sortedAll = playlists.all.map(normalizePlaylist).sort((a, b) => b.tracks - a.tracks);
      console.log("🧠 Dashboard playlists", playlists);
      console.log("🧠 Featured raw:", playlists.featured);
      setPlaylists(sortedFeatured.slice(0, 3));
      localStorage.setItem("featured_playlists", JSON.stringify(sortedFeatured.slice(0, 3)));
      localStorage.setItem("all_playlists", JSON.stringify(sortedAll));

      const normalized = Object.fromEntries(
        Object.entries(genre_map || {}).map(([k, v]) => [k.toLowerCase(), v.toLowerCase()])
      );
      setGenreMap(normalized);
      localStorage.setItem("genre_map", JSON.stringify(normalized));

      const latestTrack = played_track?.track;
      if (latestTrack) {
        setTrack(latestTrack);
        setLastUpdated(new Date());
        localStorage.setItem("last_played_track", JSON.stringify(latestTrack));
        localStorage.setItem("last_played_updated_at", new Date().toISOString());
      }

      const now = new Date();
      localStorage.setItem("last_init_home", now.toISOString());
      setLastInit(now);
      setShowSkeleton(false);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    }

    setLoadTime(Math.round(performance.now() - loadStart.current));
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
    if (!window.confirm("You sure you wanna delete your account?")) return;
    try {
      await apiDelete(`/delete-user?user_id=${user_id}`);
      logout();
    } catch (err) {
      console.error("Failed to delete account:", err);
    }
  }

  if (showSkeleton) {
    return (
      <div className="max-w-md w-full mx-auto p-4 space-y-6">
        <GlintBox width="w-24" height="h-24" rounded="rounded-full" className="mx-auto" />
        <GlintBox width="w-32" height="h-6" className="mx-auto" />
        <GlintBox width="w-24" height="h-5" rounded="rounded-full" className="mx-auto" />
        <GlintBox height="h-24" rounded="rounded-lg" />

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 space-y-3">
          <div className="h-6 w-40 rounded bg-[linear-gradient(90deg,#e0e0e0_0%,#f8f8f8_50%,#e0e0e0_100%)] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite_linear]" />
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-16 w-full rounded-md bg-[linear-gradient(90deg,#e0e0e0_0%,#f8f8f8_50%,#e0e0e0_100%)] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite_linear]"
            />
          ))}
        </div>

        <div className="h-40 w-full rounded-xl bg-[linear-gradient(90deg,#e0e0e0_0%,#f8f8f8_50%,#e0e0e0_100%)] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite_linear]" />
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto p-4">
      <div className="flex justify-between mb-2">
        {userState?.user_id && (
          <button
            onClick={() => {
              const profileUrl = `https://sinatra.live/u/${userState.user_id}`;
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
        )}

        <button
          onClick={() => setSettingsOpen(true)}
          aria-label="Open settings"
          className="text-black dark:text-white hover:opacity-60 transition"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
      <motion.div
        className="flex flex-col items-center my-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.img
          src={userState?.profile_picture || ""}
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
          {userState?.display_name || "Sgt. Pepper"}
        </motion.h1>

        <motion.a
          href={`https://open.spotify.com/user/${userState?.user_id || ""}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg text-gray-500 font-bold text-center block"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {userState?.user_id ? "@" + userState.user_id : ""}
        </motion.a>
      </motion.div>

      <Suspense fallback={null}>
        {genresData && <TopSubGenre genresData={genresData} />}
      </Suspense>

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
        {genresData && genreMap && (
          <div className="mt-3">
            <MusicTaste
              key={user_id + "_taste"} // force remount on user change
              genresData={genresData}
              genreMap={genreMap}
            />
          </div>
        )}
      </Suspense>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 mt-3 transition-colors duration-300"
      >
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold text-lg flex items-center gap-1">
            <span>🌟</span> Featured Playlists
          </div>
          <button
            aria-label="Open all user's playlists"
            onClick={() => setAllModalOpen(true)}
            className="mt-4 underline"
          >
            See All →
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {Array.isArray(playlists) ? (
            playlists.map((playlist, i) => {
              const isValid =
                playlist &&
                typeof playlist === "object" &&
                typeof playlist.name === "string" &&
                typeof playlist.tracks === "number";

              if (!isValid) {
                console.warn(`❌ Invalid playlist at index ${i}:`, playlist);
                return (
                  <div key={playlist?.id || i} className="text-red-500 text-sm">
                    ⚠️ Skipped invalid playlist
                  </div>
                );
              }

              return (
                <PlaylistCardMini
                  key={playlist.id || i}
                  playlist={playlist}
                  index={i}
                  showTracks
                />
              );
            })
          ) : (
            <div className="text-red-500">Had trouble fetching their playlist</div>
          )}
        </div>
      </motion.div>

      <Suspense fallback={null}>
        {isAllModalOpen && (
          <AllPlaylistsModal
            isOpen={isAllModalOpen}
            onClose={() => setAllModalOpen(false)}
            user_id={user_id}
            user={userState}
          />
        )}
        {isSettingsOpen && (
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setSettingsOpen(false)}
            onLogout={logout}
            onDelete={deleteAccount}
            user_id={user_id}
            onSave={loadDashboard}
          />
        )}
      </Suspense>
    </div>
  );
}

export default Home;