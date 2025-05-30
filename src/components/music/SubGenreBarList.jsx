// src/components/music/SubGenreBarList.jsx
import React from "react";
import { motion } from "@motionone/react";

function SubGenreBarList({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 transition-colors duration-300 space-y-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {data.map((genre, index) => {
        const { name, value, gradient } = genre;
        const percent = ((value / total) * 100).toFixed(1);
        const barWidth = `${percent}%`;
        const barGradient = gradient || "linear-gradient(to right, #666, #999)";

        return (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <div className="flex justify-between text-sm font-medium mb-1">
              <span className="italic">{name}</span>
              <span className="text-gray-400">{percent}%</span>
            </div>
            <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
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
    </motion.div>
  );
}

export default SubGenreBarList;