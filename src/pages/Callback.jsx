// src/pages/Callback.jsx
import { useEffect } from "react";
import Loader from "../components/Loader";

function Callback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      // Forward code to backend for token exchange and redirect
      window.location.href = `${import.meta.env.VITE_API_BASE_URL}/callback?code=${code}`;
    }
  }, []);

  return (
    <div className="text-center mt-10 text-sm text-gray-600">
      Logging into Spotify...
      <br />
      If you're not redirected, <a href="/" className="underline text-blue-600">click here</a>.
    </div>
  );
}

export default Callback;