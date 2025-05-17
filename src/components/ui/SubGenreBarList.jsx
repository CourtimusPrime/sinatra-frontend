// src/components/ui/SubGenreBarList.jsx
import React from "react";
import { motion } from "framer-motion/dom";

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

function SubGenreBarList({ data, getColorForGenre }) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;

  return (
  <>
    <motion.div
      className="space-y-3"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {data.map(({ name, value }) => {
        const percent = ((value / total) * 100).toFixed(1);
        const barColor = getColorForGenre?.(name) || "#d4af37";

        return (
          <motion.div key={name} variants={barVariants}>
            <div className="flex justify-between text-sm font-medium mb-1">
              <span className="italic">{name}</span>
              <span className="text-gray-400">{percent}%</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${percent}%`,
                  backgroundColor: barColor,
                }}
              />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  </>
);
}

export default SubGenreBarList;