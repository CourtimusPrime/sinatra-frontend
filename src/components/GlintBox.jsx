// src/components/GlintBox.jsx
import React from "react";

export default function GlintBox({
  width = "w-full",
  height = "h-6",
  rounded = "rounded-md",
  className = "",
}) {
  return (
    <div
      className={`${width} ${height} ${rounded} ${className}
        bg-[linear-gradient(90deg,#e0e0e0_0%,#f8f8f8_50%,#e0e0e0_100%)]
        bg-[length:200%_100%] animate-[shimmer_1.5s_infinite_linear]`}
    />
  );
}