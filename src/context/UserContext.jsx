// src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { apiGet } from '../utils/api';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function login(user_id) {
    apiGet(`/me?user_id=${user_id}`).then((data) => {
      if (data) setUser(data);
      document.cookie = `sinatra_user_id=${user_id}`
      console.log("✅ Authenticated as:", data.user_id);
    }).then(() => setLoading(false))
  }

  const user_id = user?.user_id;
  const importantPlaylists = user?.important_playlists || [];

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        user_id,
        loading,
        importantPlaylists,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  return useContext(UserContext)
}
