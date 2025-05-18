// src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, _setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [user_id, setUserId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("user_id");
    const fromStorage = localStorage.getItem("user_id");

    if (fromUrl) {
      localStorage.setItem("user_id", fromUrl);
      return fromUrl;
    }
    return fromStorage;
  });

  const setUser = (updates) => {
    _setUser((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  useEffect(() => {
    const isPublicProfile = window.location.pathname.startsWith("/@");
    if (!user_id || isPublicProfile) {
      setLoading(false);
      return;
    }

    fetch(`/me?user_id=${user_id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setUser({ ...data });
        }
        setLoading(false);
      })
      .catch(() => {
        setUser({});
        setLoading(false);
      });
  }, [user_id]);

  const importantPlaylists = user?.important_playlists || [];

  return (
    <UserContext.Provider value={{ user, setUser, user_id, loading, importantPlaylists }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);