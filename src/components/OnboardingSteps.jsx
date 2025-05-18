// src/components/OnboardingSteps.jsx
import React from "react";
import { useState, useEffect } from "react";
import { apiGet, apiPost } from "../utils/api";
import ProfileImageEditor from "./ui/ProfileImageEditor";

function convertToWebP(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.src = reader.result;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        const webpURL = URL.createObjectURL(blob);
        resolve(webpURL);
      }, "image/webp", 0.8); // quality between 0 and 1
    };

    reader.readAsDataURL(file);
  });
}


function OnboardingSteps({ user_id }) {
  const [step, setStep] = useState(0);
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [name, setName] = useState("");
  const [changeName, setChangeName] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [uploadedPic, setUploadedPic] = useState(null);

  useEffect(() => {
    if (!user_id) return;

    const loadUserAndPlaylists = async () => {
      try {
        const userData = await apiGet(`/me?user_id=${user_id}`);
        setUser(userData);
        setName(userData.display_name);
        setProfilePic(userData.profile_picture);

        const playlistData = await apiGet(`/playlists?user_id=${user_id}`);
        const valid = playlistData.items.filter((p) => p.tracks >= 5);
        setPlaylists(valid);
      } catch (err) {
        console.error("Onboarding fetch failed:", err);
      }
    };

    loadUserAndPlaylists();
  }, [user_id]);

  const handleNext = async () => {
    if (step === 0 && selectedIds.length === 0) {
      alert("Choose the playlists you'd like to be public.");
      return;
    }

    if (step === 1 && changeName && name.trim() === "") {
      alert("Please enter your name.");
      return;
    }

    if (step === 2) {
      submitOnboarding(uploadedPic || profilePic);
    }

    setStep(step + 1);
  };

  const submitOnboarding = (pic) => {
    const payload = {
      user_id: user_id,
      playlist_ids: selectedIds,
      display_name: name,
      profile_picture: pic,
    };

    fetch("/complete-onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => (window.location.href = "/home"))
      .catch(() => alert("Failed to submit onboarding."));
  };

  return (
    <div className="space-y-6">
      {step === 0 && (
        <div className="flex flex-col min-h-screen">
          <h2 className="text-xl font-bold mb-1">
            {user?.display_name ? `Welcome, ${user.display_name}!` : "Welcome!"}
          </h2>
          <p className="mb-4">Pick at least 3 playlists to get started.</p>

          {/* Search + Sort */}
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <input
              type="text"
              placeholder="Search..."
              className="w-full sm:w-1/2 border p-2 rounded"
              onChange={(e) =>
                setPlaylists((prev) =>
                  [...prev]
                    .sort((a, b) => a.name.localeCompare(b.name)) // reset sort
                    .filter((p) =>
                      p.name
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
                    )
                )
              }
            />
            <select
              onChange={(e) => {
                const [key, dir] = e.target.value.split(":");
                const sorted = [...playlists].sort((a, b) => {
                  if (key === "name") {
                    return dir === "asc"
                      ? a.name.localeCompare(b.name)
                      : b.name.localeCompare(a.name);
                  } else {
                    return dir === "asc"
                      ? a.tracks - b.tracks
                      : b.tracks - a.tracks;
                  }
                });
                setPlaylists(sorted);
              }}
              className="border p-2 rounded"
            >
              <option value="name:asc">Name (A–Z)</option>
              <option value="name:desc">Name (Z–A)</option>
              <option value="tracks:asc">Song Count ↑</option>
              <option value="tracks:desc">Song Count ↓</option>
            </select>
          </div>

          {/* Playlist Grid */}
          <div className="grid grid-cols-2 gap-3 overflow-y-auto pb-24">
            {playlists.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedIds((prev) =>
                    prev.includes(p.id)
                      ? prev.filter((id) => id !== p.id)
                      : [...prev, p.id]
                  );
                }}
                className={`border rounded-lg p-2 text-center cursor-pointer flex flex-col items-center transition ${
                  selectedIds.includes(p.id)
                    ? "border-blue-500 bg-blue-50"
                    : "hover:bg-gray-100"
                }`}
              >
                <img
                  src={p.image || "/static/default-cover.jpg"}
                  alt={p.name}
                  className="w-20 h-20 object-cover rounded mb-2"
                />
                <p className="text-xs font-medium text-center break-words leading-tight">
                  {p.name}
                </p>
                <p className="text-[10px] text-gray-500">{p.tracks} songs</p>
              </div>
            ))}
          </div>

          {/* Fixed HUD */}
          <div className="fixed bottom-0 left-0 w-full bg-white border-t px-4 py-3 flex justify-between items-center shadow-md">
            <span className="text-sm">Selected: {selectedIds.length}</span>
            <button
              onClick={handleNext}
              disabled={selectedIds.length < 3}
              className={`px-4 py-2 text-sm rounded ${
                selectedIds.length >= 3
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <h2>Is this your name?</h2>
          <p>"{user?.display_name}"</p>
          <label>
            <input
              type="radio"
              checked={!changeName}
              onChange={() => setChangeName(false)}
            />{" "}
            Yes
          </label>
          <label className="ml-4">
            <input
              type="radio"
              checked={changeName}
              onChange={() => setChangeName(true)}
            />{" "}
            No
          </label>
          {changeName && (
            <div className="mt-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter new name"
                className="border p-2"
              />
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-lg font-bold mb-2">Your Profile Picture</h2>
          <ProfileImageEditor
            initialImage={profilePic}
            onSave={(url) => {
              setUploadedPic(url);
              setProfilePic(url);
            }}
            onCancel={() => {
              setUploadedPic(null);
              setProfilePic(user?.profile_picture || "");
            }}
            presetAvatars={[
              "/avatars/1.webp",
              "/avatars/2.webp",
              "/avatars/3.webp",
              "/avatars/4.webp"
            ]}
          />
        </div>
      )}

      {step > 0 && step < 3 && (
        <button
          onClick={handleNext}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      )}

      {step === 3 && <p>Setting things up... please wait.</p>}
    </div>
  );
}

export default OnboardingSteps;
