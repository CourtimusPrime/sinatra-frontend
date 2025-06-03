// src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, _setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const pathname = window.location.pathname;
  const isPublicProfile = pathname.startsWith("/@");

  const [user_id, setUserId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("user_id");
    const fromStorage = localStorage.getItem("user_id");

    if (fromUrl && fromUrl !== fromStorage) {
      localStorage.setItem("user_id", fromUrl);
      return fromUrl;
    }

    if (fromStorage && fromStorage !== "null") {
      return fromStorage;
    }

    return null;
  });

  const setUser = (updates) => {
    _setUser((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  useEffect(() => {
    if (!user_id || user_id === "null" || isPublicProfile) {
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