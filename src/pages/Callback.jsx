// src/pages/Callback.jsx
import { useEffect } from "react";
import Loader from "../components/Loader";

function Callback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      // 🚨 Clear any existing localStorage data first
      localStorage.clear();

      // ✅ Redirect to backend for token exchange
      const apiBase = import.meta.env.VITE_API_BASE_URL || "https://web-production-54720.up.railway.app";
      window.location.href = `${apiBase}/callback?code=${code}`;
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center text-sm text-gray-600">
      <Loader />
      <p className="mt-4">Logging into Spotify...</p>
      <p className="mt-2">
        If you're not redirected,{" "}
        <a href="/" className="underline text-blue-600">
          click here
        </a>
        .
      </p>
    </div>
  );
}

export default Callback;