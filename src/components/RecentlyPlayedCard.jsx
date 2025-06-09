// frontend/src/components/RecentlyPlayedCard.jsx
import { RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from '@motionone/react';
import { apiGet, apiPost } from '../utils/api';
import { getMetaGenre, getMetaGradients } from '../utils/genreUtils';

function cleanTrackName(name) {
  return name
    .replace(/\s*[-–]\s*\d{4}\s*Remaster(ed)?/i, '')
    .replace(/\s*[-–]\s*Remaster(ed)?( Version)?/i, '')
    .replace(/\s*\(\s*\d{4}\s*Remaster\s*\)/i, '')
    .replace(/\s*\(\s*Remaster(ed)?\s*\)/i, '')
    .replace(/\s*\[\s*\d{4}\s*Remaster\s*\]/i, '')
    .replace(/\s*[-–]\s*Single( Version| Edit)?/i, '')
    .replace(/\s*\(\s*Single( Version| Edit)?\s*\)/i, '')
    .replace(/\s*[-–]\s*Single;\s*\d{4}\s*Remaster/i, '')
    .trim();
}

function RecentlyPlayedCard() {
  const [track, setTrack] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [animateChange, setAnimateChange] = useState(false);
  const [gradients, setGradients] = useState(null);

  const updateTrack = (newTrack) => {
    setAnimateChange(true);
    setTrack(newTrack);
    setLastUpdated(new Date().toISOString());
    setTimeout(() => setAnimateChange(false), 1000);
  };

  const fetchInitial = async () => {
    try {
      const me = await apiGet('/me');
      if (me.last_played_track) {
        updateTrack(me.last_played_track);
        return;
      }

      const now = await apiGet('/now-playing');
      if (now.track) {
        updateTrack(now.track);
        await apiPost('/update-playing');
        return;
      }

      const recent = await apiGet('/recently-played');
      if (recent.track) {
        updateTrack(recent.track);
        await apiPost('/update-playing'); // ✅ Save the recent track to DB
      }
    } catch (err) {
      console.error('🎵 Init error:', err);
    }
  };

  const refresh = async () => {
    setIsRefreshing(true);
    try {
      const now = await apiGet('/now-playing');
      if (!now.track) return;

      const recent = await apiGet('/check-recent');
      const recentTrack = recent.track?.track || recent.track;
      const nowTrack = now.track;

      if (!recentTrack || nowTrack.id !== recentTrack.id) {
        // Update DB in the background, but show nowTrack immediately
        updateTrack(nowTrack);
        apiPost('/update-playing').catch((err) =>
          console.error('❌ Failed to update track in DB:', err)
        );
      }
    } catch (err) {
      console.error('🎵 Refresh error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInitial();
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getMetaGradients().then(setGradients);
  }, []);

  if (!track) return <div className="text-gray-400"></div>;

  const getFreshnessLabel = (date) => {
    if (!date) return null;
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'just now';
    if (diffMin === 1) return '1m ago';
    return `${diffMin}m ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`relative rounded-2xl overflow-hidden text-white shadow-md w-full mt-6 transition-colors duration-300 ${
        animateChange ? 'animate-bgfade' : ''
      }`}
      style={{
        backgroundImage: track.album_art_url
          ? `url(${track.album_art_url})`
          : undefined,
        backgroundColor: !track.album_art_url
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
            ? '#111827'
            : '#ffffff'
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '140px',
        willChange: 'opacity, transform',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-sm" />

      <div className="relative z-10 p-4 flex flex-col gap-2 text-white dark:text-white">
        <h2 className="text-lg sm:text-base font-semibold flex items-center gap-2">
          🎧 Recently Played
          {lastUpdated && (
            <span className="text-xs text-gray-300 font-normal">
              ({getFreshnessLabel(lastUpdated)})
            </span>
          )}
        </h2>

        <div className="mt-2">
          <p
            className={`text-xl font-bold leading-tight ${
              animateChange ? 'animate-fadein-fast' : ''
            }`}
            title={track.name}
          >
            {cleanTrackName(track.name)}
          </p>
          <p className={`text-sm text-gray-200 ${animateChange ? 'animate-fadein-slow' : ''}`}>
            {track.artist}
          </p>

          {track.genres?.length > 0 && gradients && (
            <span
              className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full text-white shadow mt-1"
              style={{
                background: gradients[getMetaGenre(track.genres[0])],
              }}
            >
              {track.genres[0]}
            </span>
          )}
        </div>
      </div>

      <div className="absolute bottom-2 right-2 z-20">
        <button
          onClick={refresh}
          className={`text-white hover:text-gray-300 transition-colors ${
            isRefreshing ? 'animate-spin-once' : ''
          }`}
          aria-label="Refresh"
        >
          <RefreshCcw size={20} />
        </button>
      </div>
    </motion.div>
  );
}

export default RecentlyPlayedCard;