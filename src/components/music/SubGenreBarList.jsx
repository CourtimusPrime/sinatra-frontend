// src/components/music/SubGenreBarList.jsx
import React from "react";
import { motion } from "@motionone/react";
import { getMetaGenreGradient } from "../../constants/metaGenres";

function SubGenreBarList({ data, getColorForGenre, genreMap }) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;

  return (
    <div className="space-y-3">
      {data.map(({ name, value }, index) => {
        const lower = name.toLowerCase();
        const parentGenre = genreMap?.[lower] || "other";
        const percent = ((value / total) * 100).toFixed(1);
        const barGradient = getMetaGenreGradient(parentGenre);
        const barWidth = `${percent}%`;

        return (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <div className="flex justify-between text-sb font-medium mb-1">
              <span className="italic">{name}</span>
              <span className="text-gray-400">{percent}%</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: barWidth }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="h-full rounded-full"
                style={{
                  background: barGradient,
                }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default SubGenreBarList;