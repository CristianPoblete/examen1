import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="header">
      <nav className="nav container">
        <Link to="/" className="nav-logo">Tareas App</Link>
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/bienvenida" className="btn">Tareas</Link>
              <Link to="/agregar-tarea" className="btn">Agregar Tarea</Link>
              <button onClick={logout} className="btn btn-primary">Cerrar Sesión</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn">Iniciar Sesión</Link>
              <Link to="/registro" className="btn btn-primary">Registrarse</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;