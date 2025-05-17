// src/components/ui/GenreBarList.jsx
import React from "react";
import { motion } from "framer-motion";
import { getMetaGenreColor } from "../../utils/metaGenres";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const barVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

function GenreBarList({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-sm text-gray-400">No genre data available.</div>;
  }

  const total = data.reduce((sum, d) => {
    const val = typeof d.value === "number" && isFinite(d.value) ? d.value : 0;
    return sum + val;
  }, 0) || 1;

  return (
    <motion.div
      className="space-y-3"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {data.map(({ name, value }) => {
        if (typeof value !== "number" || !isFinite(value)) return null;

        const rawPercent = (value / total) * 100;
        const displayPercent = rawPercent.toFixed(1);
        const barWidth = `${rawPercent}%`;

        return (
          <motion.div key={name} variants={barVariants}>
            <div className="flex justify-between text-sm font-medium mb-1">
              <span>{name}</span>
              <span className="text-gray-500">{displayPercent}%</span>
            </div>
            <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden border border-gray-300">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: barWidth,
                  backgroundColor: getMetaGenreColor(name) || "#ccc",
                }}
              />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default GenreBarList;