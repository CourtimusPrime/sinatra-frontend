// src/components/ui/TopSubGenre.jsx
import React, { useEffect, useState } from "react";
import { isMetaGenre, fetchMetaGenres } from "../../utils/metaGenres";


function TopSubGenre({ genresData }) {
  const [topSub, setTopSub] = useState(null);

  useEffect(() => {
    const genreSource = genresData?.sub_genres || genresData?.frequency;
    if (!genreSource) return;

    const allSubGenres = Object.entries(genreSource)
      .filter(([genre]) => !isMetaGenre(genre))
      .sort((a, b) => b[1] - a[1]);

    if (allSubGenres.length > 0) {
      setTopSub(allSubGenres[0][0]);
    }

    fetchMetaGenres();
  }, [genresData]);

  if (!topSub) return null;

  return (
    <div className="text-sm text-gray-500 mt-1 text-center">
      Current taste: <span className="font-semibold">{topSub}</span>
    </div>
  );
}

export default TopSubGenre;