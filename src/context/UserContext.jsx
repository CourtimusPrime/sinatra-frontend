// src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { apiGet } from '../utils/api';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const pathname = window.location.pathname;
  const isPublicProfile = pathname.startsWith('/@');

  useEffect(() => {
    if (isPublicProfile) {
      setLoading(false);
      return;
    }

    apiGet('/me')
      .then((data) => {
        if (data?.user_id) {
          setUser(data);
        } else {
          setUser(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ /me failed:', err);
        setUser(null);
        setLoading(false);
      });
  }, []);

  const user_id = user?.user_id;
  const importantPlaylists = user?.important_playlists || [];

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        user_id,
        loading,
        importantPlaylists,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
