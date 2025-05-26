// src/components/settings/EditFeatured.jsx
import { useState, useEffect } from "react";
import { apiGet, apiPost } from "../../utils/api";
import GlintBox from "../GlintBox";
import PlaylistCardMini from "../PlaylistCardMini";

function EditFeaturedModal({ isOpen, onClose, user_id, onSave }) {
  const [allPlaylists, setAllPlaylists] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);

    apiGet(`/dashboard?user_id=${user_id}`)
      .then((data) => {
        setAllPlaylists(data.playlists.all);
        setSelected(data.playlists.featured.map((p) => p.id || p.playlist_id));
      })
      .catch((err) => {
        console.error("🔥 EditFeatured fetch failed:", err);
        setAllPlaylists([]);
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
    apiPost("/update-featured", {
      user_id,
      playlist_ids: selected,
    })
      .then(() => {
        onSave();
        onClose();
      })
      .catch((err) => {
        console.error("❌ Failed to update featured playlists:", err);
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
            <div className="grid grid-cols-2 gap-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="border p-2 rounded text-center flex flex-col items-center animate-pulse"
                >
                  <GlintBox width="w-full" height="aspect-square" rounded="rounded mb-1" />
                  <GlintBox width="w-3/4" height="h-3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {allPlaylists
                .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
                .map((p) => (
                  <PlaylistCardMini
                    key={p.id}
                    playlist={p}
                    onClick={() => handleToggle(p.id)}
                    isSelected={selected.includes(p.id)}
                    selectable
                  />
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