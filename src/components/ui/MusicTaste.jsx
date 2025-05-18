// src/components/ui/MusicTaste.jsx
import React, { useEffect, useState, useMemo } from "react";
import GenreBarList from "./GenreBarList";
import SubGenreBarList from "./SubGenreBarList";
import { useSwipeable } from "react-swipeable";
import { getMetaGenreColor, isMetaGenre } from "../../constants/metaGenres";

function MusicTaste({ genresData, genreMap }) {
  const [metaGenres, setMetaGenres] = useState([]);
  const [subGenres, setSubGenres] = useState([]);
  const [step, setStep] = useState(0);

  // ✅ Swipe gesture handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setStep((prev) => Math.min(prev + 1, 1)),
    onSwipedRight: () => setStep((prev) => Math.max(prev - 1, 0)),
    trackMouse: true,
  });

  const { computedMetaGenres, computedSubGenres } = useMemo(() => {
    if (!genresData?.highest || !genresData?.sub_genres || !genreMap) {
      return { computedMetaGenres: [], computedSubGenres: [] };
    }

    const subGenresArray = Object.keys(genresData.sub_genres);
    const filteredSubGenres = subGenresArray.filter((sub) => {
      const parent = genreMap[sub.toLowerCase()];
      return parent && parent !== "other" && parent !== sub.toLowerCase();
    });

    const finalSubGenres = filteredSubGenres.slice(0, 5);
    const topMetaGenres = Object.entries(genresData.highest)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({
        name,
        value: Math.round(value * 10) / 10,
      }));

    return {
      computedMetaGenres: topMetaGenres,
      computedSubGenres: finalSubGenres.map((name) => ({
        name,
        parent: genreMap[name.toLowerCase()],
      })),
    };
  }, [genresData, genreMap]);

  useEffect(() => {
    setMetaGenres(computedMetaGenres);
    setSubGenres(computedSubGenres);
  }, [computedMetaGenres, computedSubGenres]);

  const getColorForGenre = (name) => {
    const parent = genreMap?.[name.toLowerCase()];
    return getMetaGenreColor(parent);
  };

  const currentData = step === 0 ? metaGenres : subGenres;

  return (
    <div {...swipeHandlers} className="mt-6 bg-white rounded-2xl shadow p-4">
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