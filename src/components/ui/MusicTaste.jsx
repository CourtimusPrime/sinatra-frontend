// src/components/ui/MusicTaste.jsx
import React, { useEffect, useState } from "react";
import GenreBarList from "./GenreBarList";
import SubGenreBarList from "./SubGenreBarList";
import { useSwipeable } from "react-swipeable";
import { getMetaGenreColor, isMetaGenre, fetchMetaGenres } from "../../utils/metaGenres";

function MusicTaste({ genresData }) {
  const [step, setStep] = useState(0);
  const [metaGenres, setMetaGenres] = useState([]);
  const [subGenres, setSubGenres] = useState([]);
  const [genreMap, setGenreMap] = useState({}); // sub → parent

  useEffect(() => {
    const fetchMap = async () => {
      try {
        const res = await fetch("/genre-map");
        const json = await res.json();

        // Normalize to lowercase keys and values
        const normalized = Object.fromEntries(
          Object.entries(json).map(([k, v]) => [k.toLowerCase(), v.toLowerCase()])
        );

        setGenreMap(normalized);
      } catch (err) {
        console.error("Failed to fetch genre map:", err);
      }
    };

    fetchMap();
    fetchMetaGenres();
  }, []);

  useEffect(() => {
    if (!genresData?.highest) return;

    const topMeta = Object.entries(genresData.highest)
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