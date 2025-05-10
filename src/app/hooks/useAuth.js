// hooks/useAuth.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      router.push('/login');
    } else {
      setToken(savedToken);
    }
  }, [router]);

  return token;
};
