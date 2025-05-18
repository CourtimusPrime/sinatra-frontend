// src/utils/getParentGenre.js

import GENRE_MAP from "../components/ui/metaGenreMap";

export function getParentGenre(genre) {
  return GENRE_MAP[genre.toLowerCase()] || "other";
}