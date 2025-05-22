// src/components/steps/GenreIntro.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";

function GenreIntro({ genres, setCanProceed }) {
  useEffect(() => {
    setCanProceed(true);
  }, [setCanProceed]);

  const highestObj = genres?.highest || {};
  const subGenresObj = genres?.sub_genres || {};

  const topMetaGenres = Object.entries(highestObj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([genre]) => genre);

  const topSubGenres = Object.entries(subGenresObj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([genre]) => genre);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Your Sound in a Snapshot</h2>
      <p>Here's a quick glimpse into your most listened-to genres:</p>

      <div className="space-y-2">
        <h3 className="font-medium">Top Meta-genres:</h3>
        <ul className="list-disc ml-6">
          {topMetaGenres.map((genre, i) => (
            <motion.li key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.2 }}>
              {genre}
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Top Sub-genres:</h3>
        <ul className="list-disc ml-6">
          {topSubGenres.map((sub, i) => (
            <motion.li key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
              {sub}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default GenreIntro;