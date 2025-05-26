// src/utils/normalize.js
export function normalizePlaylist(pl) {
  return {
    ...pl,
    tracks:
      typeof pl.tracks === "number"
        ? pl.tracks
        : typeof pl.track_count === "number"
        ? pl.track_count
        : 0, // ← default fallback
    external_url:
      pl.external_url || `https://open.spotify.com/playlist/${pl.id || ""}`,
  };
}