// src/pages/Auth.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { apiGet } from '../utils/api';
const [loading, setLoading] = useState(true);

function Auth() {
  const { setUser, user } = useUser()
  const navigate = useNavigate();

  useEffect(() => {
    apiGet(`/me?user_id=${user.user_id}`).then((data) => {
      if (data?.user_id) {
        setUser(data);
        navigate('/home');
      } else {
        navigate('/');
      }
    }).catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [user])

  return (
    <div className="text-center mt-10 text-sm text-gray-600">
      Logging into Spotify...
      <br />
      If you're not redirected,{' '}
      <a href="/" className="underline text-blue-600">
        click here
      </a>
      .
    </div>
  );
}

export default Auth;
