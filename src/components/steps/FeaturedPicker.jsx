// src/components/steps/FeaturedPicker.jsx
import React, { useEffect, useState } from "react";

function FeaturedPicker({ onboardData, setOnboardData, setCanProceed }) {
  const imported = onboardData.selected_playlists || [];
  const [selected, setSelected] = useState(onboardData.featured_playlists.map(p => p.playlist_id));
  const [search, setSearch] = useState("");
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    const selectedPlaylists = imported.filter(p => selected.includes(p.id));
    setOnboardData(prev => ({ ...prev, featured_playlists: selectedPlaylists }));
    setCanProceed(selected.length === 3);
  }, [selected]);

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(prev => prev.filter(pid => pid !== id));
    } else if (selected.length < 3) {
      setSelected(prev => [...prev, id]);
    }
  };

  const toggleSort = () => {
    setSortDesc(prev => !prev);
  };

  const filtered = imported
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortDesc ? b.tracks - a.tracks : a.tracks - b.tracks);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Select Your 3 Featured Playlists</h2>
      <p className="text-sm text-gray-600">These will appear on your profile. You can change them later.</p>

      <div className="flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          placeholder="Search playlists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={toggleSort}>Sort {sortDesc ? "↓" : "↑"}</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map(p => (
          <div
            key={p.id}
            onClick={() => toggleSelect(p.id)}
            className={`border rounded p-2 cursor-pointer ${selected.includes(p.id) ? "border-green-600 bg-green-50" : ""}`}
          >
            <img src={p.image} alt={p.name} className="w-full h-32 object-cover rounded" />
            <div className="mt-2 font-medium text-sm">{p.name}</div>
            <div className="text-xs text-gray-500">{p.tracks} songs</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturedPicker;