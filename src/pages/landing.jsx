// src/pages/Landing.jsx

import React, { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Spotify from "../assets/spotify.svg";

function Landing() {
  const { user_id } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user_id) navigate("/home");
  }, [user_id]);

  const handleLogin = () => {
    const target = import.meta.env.VITE_API_BASE_URL + "/login";
    console.log("🔁 Redirecting to:", target);
    window.location.href = target;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans">
      {/* Header */}
      <div className="text-center mt-12 mb-8">
        <h1 className="text-6xl font-duckie bg-gradient-to-r from-pink-500 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient mb-4">
          Sinatra
        </h1>
        <p className="text-xl max-w-lg mx-auto font-light">
          A public music profile for showcasing your music taste: your favorite tracks, genres, playlists, and more.
        </p>
      </div>

      {/* Call to Action */}
      <div className="mt-6">
        <button
          onClick={handleLogin}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white text-lg shadow-md transition"
        >
          <img src={Spotify} alt="Spotify logo" className="w-5 h-5" />
          Login with Spotify
        </button>
      </div>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 sm:hidden">
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white text-base font-medium transition"
        >
          <img src={Spotify} alt="Spotify logo" className="w-5 h-5" />
          Start with Spotify
        </button>
      </div>
    </div>
  );
}

export default Landing;