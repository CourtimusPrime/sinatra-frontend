// src/pages/Auth.jsx
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function Auth() {
  const [params] = useSearchParams();
  const userId = params.get("user_id");
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      localStorage.setItem("user_id", userId);
      navigate("/home");
    }
  }, [userId]);

  return (
    <div className="text-center mt-10 text-sm text-gray-600">
      Logging into Spotify...
      <br />
      If you're not redirected, <a href="/" className="underline text-blue-600">click here</a>.
    </div>
  );
}

export default Auth;