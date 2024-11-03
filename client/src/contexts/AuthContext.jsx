import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Aquí podrías hacer una llamada a la API para obtener los datos del usuario
    }
  }, []);

  const login = async (correo, contraseña) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { correo, contraseña });
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      // Aquí podrías hacer una llamada adicional para obtener los datos del usuario
    } catch (error) {
      throw error.response.data.msg;
    }
  };

  const register = async (nombre, apellido, correo, contraseña) => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', { nombre, apellido, correo, contraseña });
    } catch (error) {
      throw error.response.data.msg;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}