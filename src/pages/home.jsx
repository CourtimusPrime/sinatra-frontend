// src/pages/home.jsx
import React, { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiDelete } from '../utils/api';
import { Menu, Share } from 'lucide-react';
import UserHeader from '../components/UserHeader';
import RecentlyPlayedCard from '../components/RecentlyPlayedCard';
import '../styles/loader.css';
import { motion } from '@motionone/react';
import FeaturedPlaylists from '../components/FeaturedPlaylists';
import { useMemo } from 'react';

const MusicTaste = lazy(() => import('../components/music/MusicTaste'));
const SettingsModal = lazy(
  () => import('../components/settings/SettingsModal')
);
const AllPlaylistsModal = lazy(() => import('../components/AllPlaylistsModal'));

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
  const featuredPlaylists = useMemo(() => {
    return (user?.playlists?.featured || []).slice(0, 3);
  }, [user?.playlists?.featured]);

  useEffect(() => {
    if (!loading && !user) return null;
  }, [loading, user]);

  useEffect(() => {
    if (!user || loading) return;

    setGenresData(user.genre_analysis || {});
    setTrack(user.last_played_track?.track || null);
    const last = localStorage.getItem('last_played_updated_at');
    if (last) setLastUpdated(new Date(last));
    setShowSkeleton(false);
  }, [user, loading]);

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
      const data = await apiGet(`/recently-played`);
      const latestTrack = data?.track;
      if (!latestTrack) return;

      const isSameTrack = JSON.stringify(latestTrack) === JSON.stringify(track);
      if (!isSameTrack) {
        setAnimateTrackChange(true);
        setTrack(latestTrack);
        setLastUpdated(new Date());
        localStorage.setItem('last_played_track', JSON.stringify(latestTrack));
        localStorage.setItem(
          'last_played_updated_at',
          new Date().toISOString()
        );
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

  function logout() {
    localStorage.clear();
    window.location.href = '/';
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

  if (showSkeleton) {
    return <div className="max-w-md w-full mx-auto p-4 space-y-6"></div>;
  }

  return (
    <div className="max-w-md w-full mx-auto p-4">
      {/* Share + Settings */}
      <motion.div
        className="flex justify-between mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {user?.user_id && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `https://sinatra.live/u/${user.user_id}`
              );
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? (
              <span className="text-xs font-semibold">✅</span>
            ) : (
              <Share className="w-5 h-5" />
            )}
          </button>
        )}
        <button onClick={() => setSettingsOpen(true)}>
          <Menu className="w-5 h-5" />
        </button>
      </motion.div>

      {/* User Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <UserHeader userState={user} genresData={genresData} />
      </motion.div>

      {/* Recently Played */}
      {track && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
        >
          <RecentlyPlayedCard
            track={track}
            lastUpdated={lastUpdated}
            onRefresh={loadNowPlaying}
            animateChange={animateTrackChange}
            isRefreshing={isRefreshing}
          />
        </motion.div>
      )}

      {/* Music Taste */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Suspense
          fallback={
            <div className="text-center text-sm text-gray-400">
              Loading music taste...
            </div>
          }
        >
          <MusicTaste
            genresData={user?.genre_analysis}
            userId={user?.user_id}
          />
        </Suspense>
      </motion.div>

      {/* Featured Playlists */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <FeaturedPlaylists
          playlists={featuredPlaylists}
          onSeeAll={() => setAllModalOpen(true)}
        />
      </motion.div>

      {/* Modals */}
      <Suspense fallback={null}>
        {isAllModalOpen && (
          <AllPlaylistsModal
            isOpen={true}
            onClose={() => setAllModalOpen(false)}
            user={user}
          />
        )}
        {isSettingsOpen && (
          <SettingsModal
            isOpen={true}
            onClose={() => setSettingsOpen(false)}
            onLogout={logout}
            onDelete={deleteAccount}
            user={user}
          />
        )}
      </Suspense>
    </div>
  );
}

export default Home;
