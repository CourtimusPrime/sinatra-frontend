// src/utils/metaGenres.js
let metaGenreColors = {};
let metaGenres = [];

export async function fetchMetaGenres() {
  const res = await fetch("/meta-genre-schema");
  const json = await res.json();
  metaGenreColors = json;
  metaGenres = Object.keys(json);
}

export function getMetaGenreColor(name) {
  return metaGenreColors[name?.toLowerCase()] || "#d4af37";
}

export function isMetaGenre(name) {
  return metaGenres.includes(name?.toLowerCase());
}