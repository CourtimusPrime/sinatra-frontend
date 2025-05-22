// src/components/steps/GenreIntro.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function GenreIntro({ genres, setCanProceed }) {
  const [showSubGenres, setShowSubGenres] = useState(false);

  useEffect(() => {
    setCanProceed(true);
    const timer = setTimeout(() => setShowSubGenres(true), 3000);
    return () => clearTimeout(timer);
  }, []);

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
    <div className="space-y-10 text-center">
      <motion.div
        key="meta"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-2">Welcome to Sinatra 👋</h2>
        <p className="text-gray-700 mb-4">It seems you're a pretty big fan of:</p>
        <ul className="list-disc ml-6 text-left inline-block">
          {topMetaGenres.map((genre, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.2 }}
            >
              {genre}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {showSubGenres && (
        <motion.div
          key="sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-2">To be specific...</h2>
          <p className="text-gray-700 mb-4">Lately you've been especially fond of these types of music:</p>
          <ul className="list-disc ml-6 text-left inline-block">
            {topSubGenres.map((sub, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                {sub}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}

export default GenreIntro;