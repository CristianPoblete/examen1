import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Bienvenida from './pages/Bienvenida';
import AgregarTarea from './pages/AgregarTarea';
import EditarTarea from './pages/EditarTarea';
import Header from './components/Header';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route 
                path="/bienvenida" 
                element={
                  <ProtectedRoute>
                    <Bienvenida />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/agregar-tarea" 
                element={
                  <ProtectedRoute>
                    <AgregarTarea />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/editar-tarea/:id" 
                element={
                  <ProtectedRoute>
                    <EditarTarea />
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;