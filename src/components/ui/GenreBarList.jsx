// src/components/ui/GenreBarList.jsx
import React from "react";
import { motion } from "@motionone/react";
import { getMetaGenreGradient } from "../../constants/metaGenres";

function GenreBarList({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-sm text-gray-400">No genre data available.</div>;
  }

  const total = data.reduce((sum, d) => {
    const val = typeof d.value === "number" && isFinite(d.value) ? d.value : 0;
    return sum + val;
  }, 0) || 1;

  return (
    <div className="space-y-3">
      {data.map(({ name, value }, index) => {
        if (typeof value !== "number" || !isFinite(value)) return null;

        const rawPercent = (value / total) * 100;
        const displayPercent = rawPercent.toFixed(1);
        const barWidth = `${rawPercent}%`;

        return (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <div className="flex justify-between text-sb font-medium mb-1">
              <span>{name}</span>
              <span className="text-gray-500">{displayPercent}%</span>
            </div>
            <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: barWidth }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="h-full rounded-full"
                style={{
                  background: getMetaGenreGradient(name) || "#ccc",
                }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default GenreBarList;