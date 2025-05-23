// src/components/steps/PlaylistImporter.jsx
import React, { useEffect, useState } from "react";
import { apiGet } from "../../utils/api";

function PlaylistImporter({ user, onboardData, setOnboardData, setCanProceed }) {
  const [playlists, setPlaylists] = useState([]);
  const [selectedIds, setSelectedIds] = useState(onboardData.selected_playlists.map(p => p.playlist_id));
  const [sortDesc, setSortDesc] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    apiGet(`/playlists?user_id=${user.id}`)
      .then(res => {
        const sorted = res.items.sort((a, b) => b.tracks - a.tracks);
        setPlaylists(sorted);
      })
      .catch(err => console.error("Playlist fetch failed:", err));
  }, [user.id]);

  useEffect(() => {
    const selected = playlists.filter(p => selectedIds.includes(p.id));
    setOnboardData(prev => ({ ...prev, selected_playlists: selected }));
    setCanProceed(selected.length >= 3);
  }, [selectedIds]);

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSort = () => {
    setSortDesc(prev => !prev);
    setPlaylists(prev => [...prev].sort((a, b) => sortDesc ? a.tracks - b.tracks : b.tracks - a.tracks));
  };

  const toggleAll = () => {
    if (selectedIds.length === playlists.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(playlists.map(p => p.id));
    }
  };

  const filtered = playlists.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Select Playlists to Import</h2>

      <div className="flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          placeholder="Search playlists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={toggleSort}>Sort {sortDesc ? "↓" : "↑"}</button>
        <button onClick={toggleAll}>{selectedIds.length === playlists.length ? "Deselect All" : "Select All"}</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map(p => (
          <div
            key={p.id}
            onClick={() => toggleSelect(p.id)}
            className={`border rounded p-2 cursor-pointer ${selectedIds.includes(p.id) ? "border-blue-600 bg-blue-50" : ""}`}
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

export default PlaylistImporter;