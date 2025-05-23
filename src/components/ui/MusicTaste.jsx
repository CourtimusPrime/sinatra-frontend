// src/components/ui/MusicTaste.jsx
import React, { useEffect, useState, useMemo } from "react";
import GenreBarList from "./GenreBarList";
import SubGenreBarList from "./SubGenreBarList";
import { useSwipeable } from "react-swipeable";
import { isMetaGenre } from "../../constants/metaGenres";

function MusicTaste({ genresData, genreMap }) {
  const [step, setStep] = useState(0);

  const metaGenres = useMemo(() => {
    if (!genresData?.highest) return [];

    const highestEntries = Array.isArray(genresData.highest)
      ? genresData.highest
      : Object.entries(genresData.highest);

    return highestEntries
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({
        name,
        value: Math.round(value * 10) / 10,
      }));
  }, [genresData]);

  

  const subGenres = useMemo(() => {
    if (!genresData?.sub_genres || !genreMap) return [];

    return Object.entries(genresData.sub_genres)
      .filter(([name]) => {
        const lower = name.toLowerCase();
        const parent = genreMap[lower];
        const isExcluded =
          !parent || parent === lower || isMetaGenre(lower);

        if (isExcluded) {
          console.log(`🚫 Excluded sub-genre: ${name} → parent: ${parent}`);
        }

        return !isExcluded;
      })
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  }, [genresData, genreMap]);

  const handlers = useSwipeable({
    onSwipedLeft: () => setStep((prev) => Math.min(prev + 1, 1)),
    onSwipedRight: () => setStep((prev) => Math.max(prev - 1, 0)),
    trackTouch: true,
    trackMouse: true,
  });

  const currentData = step === 0 ? metaGenres : subGenres;
  const title = step === 0 ? "🎸 Top Genres" : "🧩 Top Sub-genres";

  return (
    <div {...handlers} className="mt-6 bg-white rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>

      {!currentData.length ? (
        <div className="text-sm text-gray-400">Loading genre data...</div>
      ) : step === 0 ? (
        <GenreBarList data={metaGenres} />
      ) : (
        <SubGenreBarList data={subGenres} genreMap={genreMap} />
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