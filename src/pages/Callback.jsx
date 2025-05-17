// src/pages/Callback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      // Send to backend: /callback?code=...
      window.location.href = `${import.meta.env.VITE_API_BASE_URL}/callback?code=${code}`;
    } else {
      navigate("/");
    }
  }, []);

  return <p className="text-center mt-10">Logging in...</p>;
}

export default Callback;