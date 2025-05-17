// src/context/UserContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
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

  useEffect(() => {
    if (!user_id) {
      setLoading(false); // ✅ Don't leave loading hanging
      return;
    }

    fetch(`/me?user_id=${user_id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setUser({
            ...data,
            user_id: data.user_id,
            genreAnalysis: data.genre_analysis || null,
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
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

export function useUser() {
  return useContext(UserContext);
}