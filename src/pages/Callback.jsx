// src/pages/Callback.jsx
import { useEffect } from "react";
import Loader from "../components/Loader";

function Callback() {
  useEffect(() => {
    localStorage.clear(); // optional
    // do nothing – let backend handle redirection
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