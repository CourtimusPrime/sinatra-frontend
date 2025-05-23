// src/constants/metaGenres.js

export const metaGenreGradients = {
  rock: "linear-gradient(to right, #ff6f61, #ff9478)",
  pop: "linear-gradient(to right, #90D5FF, #c6e8ff)",
  "r&b": "linear-gradient(to right, #88b04b, #a6c96a)",
  electronic: "linear-gradient(to right, #009688, #33bbaa)",
  "hip-hop": "linear-gradient(to right, #f7cac9, #fadcdc)",
  metal: "linear-gradient(to right, #505050, #6e6e6e)",
  folk: "linear-gradient(to right, #8d5524, #b5773d)",
  jazz: "linear-gradient(to right, #6b5b95, #8e78b0)",
  reggae: "linear-gradient(to right, #33cc99, #66ddb3)",
  blues: "linear-gradient(to right, #000080, #2e3cae)",
  other: "linear-gradient(to right, #000080, #2e3cae)",
};

export const metaGenreEmojis = {
  rock: "🎸",
  pop: "🎤",
  "r&b": "🪩",
  electronic: "🎛️",
  "hip-hop": "📻",
  metal: "🔥",
  folk: "🪕",
  jazz: "🎷",
  reggae: "🌴",
  blues: "🌊",
  other: "🃏",
}


const metaGenres = Object.keys(metaGenreGradients);

export function getMetaGenreGradient(name) {
  const key = name?.toLowerCase();
  return metaGenreGradients[key] || "linear-gradient(to right, #666, #999)";
}

export function isMetaGenre(name) {
  return metaGenres.includes(name?.toLowerCase());
}