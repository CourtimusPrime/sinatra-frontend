// src/utils/normalize.js
export function normalizePlaylist(pl) {
  const id = pl.id || pl.playlist_id;
  return {
    ...pl,
    id, // normalized ID
    playlist_id: id, // ensure both are usable
    tracks:
      typeof pl.tracks === "number"
        ? pl.tracks
        : typeof pl.track_count === "number"
        ? pl.track_count
        : pl.tracks?.total ?? 0,
    external_url:
      pl.external_url || `https://open.spotify.com/playlist/${id || ""}`,
  };
}