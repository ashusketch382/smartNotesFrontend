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
      // Fetch user data
      axios
        .get('http://localhost:4000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser({ id: response.data.id, email: response.data.email });
          setLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch user:', error);
          localStorage.removeItem('token'); // Clear invalid token
          setLoading(false);
          router.push('/login');
        });
    } else {
      setLoading(false);
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
