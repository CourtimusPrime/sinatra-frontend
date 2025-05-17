// src/components/RecentlyPlayedCard.jsx
import { RefreshCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "@motionone/react";

function cleanTrackName(name) {
  return name
    .replace(/\s*[-–]\s*\d{4}\s*Remaster(ed)?/i, "")
    .replace(/\s*[-–]\s*Remaster(ed)?( Version)?/i, "")
    .replace(/\s*\(\s*\d{4}\s*Remaster\s*\)/i, "")
    .replace(/\s*\(\s*Remaster(ed)?\s*\)/i, "")
    .replace(/\s*\[\s*\d{4}\s*Remaster\s*\]/i, "")
    .replace(/\s*[-–]\s*Single( Version| Edit)?/i, "")
    .replace(/\s*\(\s*Single( Version| Edit)?\s*\)/i, "")
    .replace(/\s*[-–]\s*Single;\s*\d{4}\s*Remaster/i, "")
    .trim();
}

function RecentlyPlayedCard({
  track,
  lastUpdated,
  onRefresh,
  animateChange,
  isRefreshing,
}) {
  const getFreshnessLabel = (date) => {
    if (!date) return null;
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return "just now";
    if (diffMin === 1) return "1m ago";
    return `${diffMin}m ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative rounded-2xl overflow-hidden text-white shadow-md w-full mt-6 ${
        animateChange ? "animate-bgfade" : ""
      }`}
      style={{
        backgroundImage: `url(${track.album_art_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "140px",
        willChange: "opacity, transform",
      }}
    >
      {/* 🔲 Blur overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-sm" />

      {/* 🎵 Main content */}
      <div className="relative z-10 p-4 flex flex-col gap-2">
        <h2 className="text-sm sm:text-base font-semibold flex items-center gap-2">
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
              animateChange ? "animate-fadein-fast" : ""
            }`}
            title={track.name}
          >
            {cleanTrackName(track.name)}
          </p>
          <p
            className={`text-sm text-gray-200 ${
              animateChange ? "animate-fadein-slow" : ""
            }`}
          >
            {track.artist}
          </p>
        </div>
      </div>

      {/* 🔁 Refresh button in bottom-right corner */}
      <div className="absolute bottom-2 right-2 z-20">
        <button
          onClick={onRefresh}
          className={`text-white hover:text-gray-300 transition-colors ${
            isRefreshing ? "animate-spin-once" : ""
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