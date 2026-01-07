'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { redirect, usePathname } from 'next/navigation';

const hardcodedUsers = {
  'admin@goldengate.com': { password: '1234', role: 'admin' },
  'cajero@goldengate.com': { password: '1234', role: 'cajero' },
};

type User = {
  email: string;
  role: 'admin' | 'cajero';
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email: string, password: string) => {
    const foundUser = hardcodedUsers[email as keyof typeof hardcodedUsers];
    if (foundUser && foundUser.password === password) {
      const userData: User = { email, role: foundUser.role };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      redirect('/dashboard');
    } else {
      throw new Error('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    redirect('/login');
  };

  useEffect(() => {
    if (!loading) {
      const publicPaths = ['/login'];
      const isPublicPath = publicPaths.includes(pathname);

      if (!user && !isPublicPath) {
        redirect('/login');
      }
      if (user && isPublicPath) {
        redirect('/dashboard');
      }
    }
  }, [user, loading, pathname]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
