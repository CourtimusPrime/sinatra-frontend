// src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { apiGet } from '../utils/api';
import { getUserCookie } from '../utils/cookie';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function login(user_id) {
    try {
      const me = await apiGet(`/me?user_id=${user_id}`);
      const dash = await apiGet('/dashboard');
      setUser({
        ...me,
        playlists: dash.playlists,
        genres: dash.genres,
        last_played: dash.last_played,
      });
      document.cookie = `sinatra_user_id=${user_id}; path=/`;
      console.log('✅ Authenticated as:', me.user_id);
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const id = getUserCookie();
    if (id) {
      login(id);
    } else {
      setLoading(false);
    }
  }, []);

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
  return useContext(UserContext);
};
