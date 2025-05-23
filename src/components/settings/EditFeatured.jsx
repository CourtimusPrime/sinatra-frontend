// src/components/settings/EditFeatured.jsx
import { useState, useEffect } from "react";

function EditFeaturedModal({ isOpen, onClose, user_id, onSave }) {
  const [allPlaylists, setAllPlaylists] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    fetch(`/all-playlists?user_id=${user_id}`)
      .then((r) => r.json())
      .then((data) => {
        setAllPlaylists(data);
        fetch(`/dashboard?user_id=${user_id}`)
        .then((res) => res.json())
        .then((data) => {
          setAllPlaylists(data.playlists.all);
          setSelected(data.playlists.featured.map((p) => p.id || p.playlist_id));
        });
      })
      .finally(() => setLoading(false));
  }, [isOpen, user_id]);

  const handleToggle = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((pid) => pid !== id);
      if (prev.length < 3) return [...prev, id];
      return prev;
    });
  };

  const handleSave = () => {
    fetch("/update-featured", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, playlist_ids: selected }),
    }).then(() => {
      onSave();
      onClose();
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow w-full max-w-md flex flex-col max-h-[90vh]">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold mb-2">Select 3 Featured Playlists</h2>
          <input
            type="text"
            placeholder="Search playlists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="p-4 overflow-y-auto flex-1 relative min-h-[200px]">
          {loading ? (
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {allPlaylists
                .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
                .map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleToggle(p.id)}
                    className={`border p-2 rounded cursor-pointer text-center transition ${
                      selected.includes(p.id)
                        ? "bg-blue-100 border-blue-500"
                        : ""
                    }`}
                  >
                    <div className="w-full aspect-square overflow-hidden rounded mb-1">
                      <img
                        src={p.image}
                        className="w-full h-full object-cover"
                        alt={p.name}
                      />
                    </div>
                    <p className="text-sm truncate">{p.name}</p>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end space-x-2">
          <button aria-label="Close modal" onClick={onClose} className="text-sm underline">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={selected.length !== 3}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditFeaturedModal;
