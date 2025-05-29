// src/components/ui/TopSubGenre.jsx
import React, { useEffect, useState } from "react";
import { getMetaGenreGradient } from "../../constants/metaGenres";
import { apiGet } from "../../utils/api";

function TopSubGenre({ user_id }) {
  const [topSub, setTopSub] = useState(null);
  const [meta, setMeta] = useState("other");

  useEffect(() => {
    if (!user_id) return;

    apiGet(`/top-subgenre?user_id=${user_id}`)
      .then(({ top_subgenre, meta_genre }) => {
        if (top_subgenre) {
          setTopSub(top_subgenre);
          setMeta(meta_genre || "other");
        }
      })
      .catch((err) => console.error("Failed to fetch top subgenre:", err));
  }, [user_id]);

  if (!topSub) return null;

  return (
    <div className="text-sm text-gray-500 text-center">
      Current taste:{" "}
      <span
        className="font-semibold bg-clip-text text-transparent"
        style={{ backgroundImage: getMetaGenreGradient(meta) }}
      >
        {topSub}
      </span>
    </div>
  );
}

export default TopSubGenre;