// src/components/ui/TopSubGenre.jsx
import React from 'react';

function TopSubGenre({ genreData }) {
  if (!genreData?.top_subgenre?.sub_genre) return null;

  const topSub = genreData.top_subgenre.sub_genre;
  const gradient =
    genreData.top_subgenre.gradient || 'linear-gradient(to right, #666, #999)';

  return (
    <div className="text-sm text-gray-500 text-center">
      Current taste:{' '}
      <span
        className="font-semibold bg-clip-text text-transparent"
        style={{ backgroundImage: gradient }}
      >
        {topSub}
      </span>
    </div>
  );
}

export default TopSubGenre;
