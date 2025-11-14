import { createContext, useContext, useEffect, useState } from 'react';
import client from '../api/client';

type User = {
  id: number;
  role: 'ADMIN' | 'EMPLOYEE';
  firstName: string;
  lastName: string;
};

interface AuthContextShape {
  user?: User;
  token?: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextShape>({
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string | undefined>(localStorage.getItem('token') || undefined);

  useEffect(() => {
    if (token) {
      client
        .get('/auth/me')
        .then((res) => setUser(res.data))
        .catch(() => logout());
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const { data } = await client.post('/auth/login', { email, password });
    setToken(data.token);
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.user.role);
    setUser(data.user);
  };

  const logout = () => {
    setToken(undefined);
    localStorage.removeItem('token');
    setUser(undefined);
    localStorage.removeItem('role');
  };

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
