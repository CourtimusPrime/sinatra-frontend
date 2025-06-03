// src/pages/Auth.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { apiGet } from "../utils/api";

function Auth() {
  const { setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // 🔄 Use cookie to get current user
    apiGet("/me", { withCredentials: true })
      .then((data) => {
        if (data?.user_id) {
          setUser(data.user_id);
          navigate("/home");
        } else {
          navigate("/"); // fallback
        }
      })
      .catch((err) => {
        console.error("❌ Auth error:", err);
        navigate("/");
      });
  }, []);

  return (
    <div className="text-center mt-10 text-sm text-gray-600">
      Logging into Spotify...
      <br />
      If you're not redirected, <a href="/" className="underline text-blue-600">click here</a>.
    </div>
  );
}

export default Auth;