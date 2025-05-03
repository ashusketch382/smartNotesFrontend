// context/AuthContext.tsx
"use client";
import { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation'; // Updated for Next.js 13+
import axios from 'axios';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:4000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser({ id: response.data.id, email: response.data.email });
          setLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch user:', error.response?.data || error.message);
          if (error.response?.status === 401) {
            console.log('AuthContext: Invalid token, clearing...');
            localStorage.removeItem('token');
            setUser(null);
          }
          setLoading(false);
          router.push('/signin');
        });
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/signin');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
