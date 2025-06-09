// src/pages/home.jsx
import React, { useEffect, useState, lazy, Suspense, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { apiGet, apiDelete } from '../utils/api';
import { Menu, Share } from 'lucide-react';
import { motion } from '@motionone/react';
import { apiLogout } from '../utils/api';

import UserHeader from '../components/UserHeader';
import RecentlyPlayedCard from '../components/RecentlyPlayedCard';
import FeaturedPlaylists from '../components/FeaturedPlaylists';
import '../styles/loader.css';

const MusicTaste = lazy(() => import('../components/music/MusicTaste'));
const SettingsModal = lazy(() => import('../components/settings/SettingsModal'));
const AllPlaylistsModal = lazy(() => import('../components/AllPlaylistsModal'));

function Home() {
  const navigate = useNavigate();
  const { user, user_id, loading, setUser } = useUser();

  const [track, setTrack] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [genresData, setGenresData] = useState(null);
  const [copied, setCopied] = useState(false);

  const [isAllModalOpen, setAllModalOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [animateTrackChange, setAnimateTrackChange] = useState(false);

  const featuredPlaylists = useMemo(
    () => (user?.playlists?.featured || []).slice(0, 3),
    [user?.playlists?.featured]
  );

  // 🧠 Fetch genre data
  useEffect(() => {
    apiGet("/genres")
      .then(setGenresData)
      .catch((err) => console.error("Failed to load genres:", err));
  }, []);

  // 🎵 Load last played track
  useEffect(() => {
    if (!user || loading) return;
    setTrack(user.last_played_track?.track || null);
    const last = localStorage.getItem('last_played_updated_at');
    if (last) setLastUpdated(new Date(last));
  }, [user, loading]);

  // 📦 Load playlists only from /dashboard
  useEffect(() => {
    if (!user_id) return;

    apiGet('/dashboard')
      .then((res) => {
        setUser(prev => ({
          ...prev,
          playlists: res.playlists,
          genres: res.genres,
          last_played: res.last_played,
        }));
      })
      .catch((err) => {
        console.error('Failed to fetch /dashboard:', err);
      });
  }, [user_id]);

  async function loadNowPlaying() {
    setIsRefreshing(true);
    try {
      const { track: latestTrack } = await apiGet(`/recently-played`);
      if (!latestTrack) return;

      const isSame = JSON.stringify(latestTrack) === JSON.stringify(track);
      if (!isSame) {
        setAnimateTrackChange(true);
        setTrack(latestTrack);
        setLastUpdated(new Date());
        localStorage.setItem('last_played_track', JSON.stringify(latestTrack));
        localStorage.setItem('last_played_updated_at', new Date().toISOString());
        setTimeout(() => setAnimateTrackChange(false), 500);
      }
    } catch (err) {
      console.error('Recently played error:', err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  }

  async function refreshSession() {
    try {
      await apiGet(`/refresh-session`);
    } catch {
      localStorage.clear();
      window.location.href = '/';
    }
  }

  async function logout() {
    try {
      await apiLogout(); // ✅ clears the cookie from backend
    } catch (err) {
      console.error('Logout failed:', err);
    }

    localStorage.clear(); // 🧹 clear any cached frontend data
    window.location.href = '/'; // 🔁 hard reset to landing
  }

  async function deleteAccount() {
    if (!window.confirm('You sure you wanna delete your account?')) return;
    try {
      await apiDelete(`/delete-user?user_id=${user_id}`);
      logout();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  }

  const isReady = user && genresData && !loading;
  if (!isReady) {
    return (
      <div className="loader-container">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto p-4 space-y-4">
      {/* 🔗 Share + ⚙️ Settings */}
      <motion.div
        className="flex justify-between"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {user?.user_id && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(`https://sinatra.live/u/${user.user_id}`);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? <span className="text-xs font-semibold">✅</span> : <Share className="w-5 h-5" />}
          </button>
        )}
        <button onClick={() => setSettingsOpen(true)}>
          <Menu className="w-5 h-5" />
        </button>
      </motion.div>

      {/* 🧑‍🎤 User Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <UserHeader userState={user} genresData={genresData} />
      </motion.div>

      {/* 🎧 Recently Played */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <RecentlyPlayedCard
          track={track}
          lastUpdated={lastUpdated}
          isRefreshing={isRefreshing}
          animateTrackChange={animateTrackChange}
          onRefresh={loadNowPlaying}
        />
      </motion.div>

      {/* 🎼 Music Taste */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Suspense fallback={<div className="text-center text-sm text-gray-400">Loading music taste...</div>}>
          <MusicTaste genresData={genresData} userId={user?.user_id} />
        </Suspense>
      </motion.div>

      {/* 📻 Featured Playlists */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <FeaturedPlaylists playlists={featuredPlaylists} onSeeAll={() => setAllModalOpen(true)} />
      </motion.div>

      {/* ⚙️ Modals */}
      <Suspense fallback={null}>
        {isAllModalOpen && (
          <AllPlaylistsModal
            isOpen
            onClose={() => setAllModalOpen(false)}
            playlists={user?.playlists?.all || []}
            user={user}
          />
        )}
        {isSettingsOpen && (
          <SettingsModal
            isOpen
            onClose={() => setSettingsOpen(false)}
            onLogout={logout}
            onDelete={deleteAccount}
            user={user}
            user_id={user?.user_id}
            setUser={setUser}
            onSave={async () => {
              try {
                const fresh = await apiGet('/dashboard');
                setUser(prev => ({
                  ...prev,
                  playlists: fresh.playlists,
                  genres: fresh.genres,
                  last_played: fresh.last_played,
                }));
              } catch (err) {
                console.error('Failed to refresh user after featured update:', err);
              }
            }}
          />
        )}
      </Suspense>
    </div>
  );
}

export default Home;