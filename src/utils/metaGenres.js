// src/utils/metaGenres.js

const metaGenreColors = {
  rock: "#ff6f61",
  pop: "#90D5FF",
  "r&b": "#88b04b",
  electronic: "#009688",
  "hip-hop": "#f7cac9",
  metal: "#505050",
  folk: "#8d5524",
  jazz: "#6b5b95",
  reggae: "#33cc99",
  other: "#9e9e9e",
};

const metaGenres = Object.keys(metaGenreColors);

export function getMetaGenreColor(name) {
  return metaGenreColors[name?.toLowerCase()] || "#000080"; // fallback navy
}

export function isMetaGenre(name) {
  return metaGenres.includes(name?.toLowerCase());
}