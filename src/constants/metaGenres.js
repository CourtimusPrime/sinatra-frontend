// src/constants/metaGenres.js

export const metaGenreColors = {
  rock: "#ff6f61",
  pop: "#90D5FF",
  "r&b": "#88b04b",
  electronic: "#009688",
  "hip-hop": "#f7cac9",
  metal: "#505050",
  folk: "#8d5524",
  jazz: "#6b5b95",
  reggae: "#33cc99",
  other: "#000080",
};

const metaGenres = Object.keys(metaGenreColors);

export function getMetaGenreColor(name) {
  const key = name?.toLowerCase();
  return metaGenreColors[key] || metaGenreColors["other"];
}

export function isMetaGenre(name) {
  return metaGenres.includes(name?.toLowerCase());
}