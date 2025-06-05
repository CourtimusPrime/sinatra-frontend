// src/pages/Landing.jsx
import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Spotify from '../assets/spotify.svg';

function Landing() {
  const { user_id } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("sinatra_user_id="));

    if (!cookie) {
      console.log("🍪 sinatra_user_id cookie not found yet");
      return;
    }

    fetch(`${import.meta.env.VITE_API_BASE_URL}/me`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("GET /me failed");
        return res.json();
      })
      .then((data) => {
        if (data?.user_id) {
          console.log("✅ Authenticated as:", data.user_id);
          navigate("/home");
        }
      })
      .catch((err) => {
        console.error("❌ /me failed:", err);
      });
  }, []);

  const handleLogin = () => {
    console.log('🧪 VITE_PRO_CALLBACK:', import.meta.env.VITE_PRO_CALLBACK);
    console.log('🧪 VITE_DEV_CALLBACK:', import.meta.env.VITE_DEV_CALLBACK);
    const state = crypto.randomUUID();
    document.cookie = `spotify_state=${state}; path=/; SameSite=None; Secure`;

    const isLocal = window.location.hostname === 'localhost';
    const redirectUri = "https://api.sinatra.live/callback";

    const loginUrl = `${import.meta.env.VITE_API_BASE_URL}/login?state=${state}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = loginUrl;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center">
      <div className="text-center max-w-xl w-full px-4">
        <h1 className="text-6xl font-duckie bg-gradient-to-r from-pink-500 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient mb-4">
          Sinatra
        </h1>
        <p className="text-xl font-light mb-6">
          A public page for your music taste.
        </p>

        <div className="flex justify-center">
          <button
            onClick={handleLogin}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white text-lg shadow-md transition"
          >
            <img src={Spotify} alt="Spotify logo" className="w-5 h-5" />
            Login with Spotify
          </button>
        </div>
      </div>
    </div>
  );
}

export default Landing;
