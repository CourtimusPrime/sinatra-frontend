// src/components/ui/MusicTaste.jsx
import React, { useEffect, useState } from "react";
import GenreBarList from "./GenreBarList";
import SubGenreBarList from "./SubGenreBarList";
import { useSwipeable } from "react-swipeable";
import { getMetaGenreColor, isMetaGenre } from "../../constants/metaGenres";

const BASE_API = import.meta.env.VITE_API_BASE_URL || "https://sinatra.up.railway.app";

function MusicTaste({ genresData, genreMap }) {
  const [step, setStep] = useState(0);
  const [metaGenres, setMetaGenres] = useState([]);
  const [subGenres, setSubGenres] = useState([]);

  useEffect(() => {
    if (!genresData?.highest) return;

    const highestEntries = Object.entries(genresData.highest);
    console.log("💽 genresData.highest", highestEntries);

    const topMeta = highestEntries
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value: Math.round(value * 10) / 10 }));

    setMetaGenres(topMeta);
  }, [genresData]);

  useEffect(() => {
    if (!genresData?.sub_genres || Object.keys(genreMap).length === 0) return;

    console.log("🧪 Sub-genre filtering started");
    console.log("📦 sub_genres:", Object.keys(genresData.sub_genres).slice(0, 10));
    console.log("🗺️ genreMap sample:", Object.entries(genreMap).slice(0, 10));

    const topSub = Object.entries(genresData.sub_genres)
      .filter(([name]) => {
        const lower = name.toLowerCase();
        const parent = genreMap[lower];
        const isValid = parent && parent !== lower && !isMetaGenre(lower);
        if (!isValid) {
          console.log(`❌ Excluded sub-genre: ${name} (parent: ${parent})`);
        }
        return isValid;
      })
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));

    console.log("✅ Final sub-genres:", topSub.map(d => d.name));

    setSubGenres(topSub);
  }, [genresData, genreMap]);

  const handlers = useSwipeable({
    onSwipedLeft: () => setStep((prev) => Math.min(prev + 1, 1)),
    onSwipedRight: () => setStep((prev) => Math.max(prev - 1, 0)),
  });

  const getColorForGenre = (subGenre) => {
    const parent = genreMap[subGenre?.toLowerCase()] || "other";
    return getMetaGenreColor(parent);
  };

  const currentData = step === 0 ? metaGenres : subGenres;
  console.log("🎯 metaGenres state", metaGenres);
  console.log("🧩 subGenres state", subGenres);

  return (
    <div {...handlers} className="mt-6 bg-white rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold mb-2">
        {step === 0 ? "🎸 Top Genres" : "🧩 Top Sub-genres"}
      </h2>
      {!currentData.length ? (
        <div className="text-sm text-gray-400">Loading genre data...</div>
      ) : step === 0 ? (
        <GenreBarList data={metaGenres} />
      ) : (
        <SubGenreBarList data={subGenres} getColorForGenre={getColorForGenre} />
      )}

      {/* ✅ Clickable + animated dots */}
      <div className="flex justify-center gap-2 mt-4">
        {[0, 1].map((i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === step ? "bg-gray-800 scale-110" : "bg-gray-300 scale-90"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default MusicTaste;