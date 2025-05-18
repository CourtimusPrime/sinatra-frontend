// src/pages/Landing.jsx

import * as React from "react";
import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Spotify from "../assets/spotify.svg";

function Landing() {
  const { user_id, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user_id) {
      navigate("/home");
    }
  }, [user_id]);

  const handleLogin = () => {
    const target = import.meta.env.VITE_API_BASE_URL + "/login";
    console.log("🔁 Redirecting to:", target);
    window.location.href = target;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <div className="max-w-md w-full mx-auto p-6 text-center">
        <h1 className="text-6xl font-duckie mb-6 bg-gradient-to-r from-pink-500 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
          Sinatra
        </h1>
        <p className="mb-6 text-lg">
          A link-in-bio profile for your music taste.
        </p>
        <button
          onClick={handleLogin}
          className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 mx-auto"
        >
          <img src={Spotify} alt="Spotify logo" className="w-5 h-5 mr-2" />
          Login with Spotify
        </button>
      </div>
    </div>
  );
}

export default Landing;