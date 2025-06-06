// src/utils/genreUtils.js
let cachedGradients = null;

export async function getMetaGradients() {
  if (cachedGradients) return cachedGradients;
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/meta-gradients`);
    const data = await res.json();
    cachedGradients = data;
    return data;
  } catch (err) {
    console.error("Failed to fetch genre gradients", err);
    return {};
  }
}

export function getMetaGenre(genre) {
  const lower = genre.toLowerCase();
  const knownMetaGenres = [
    "rock", "pop", "r&b", "electronic", "hip hop", "hip-hop", "metal",
    "folk", "jazz", "reggae", "blues", "country", "new age", "classical",
    "easy listening", "latin", "religious", "vocal", "indie"
  ];

  return knownMetaGenres.find((meta) => lower.includes(meta)) || "other";
}