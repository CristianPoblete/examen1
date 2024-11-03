import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({
    correo: '',
    contraseña: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(formData.correo, formData.contraseña);
      navigate('/bienvenida');
    } catch (err) {
      setError('Credenciales inválidas');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="correo" className="form-label">Correo electrónico</label>
            <input
              id="correo"
              name="correo"
              type="email"
              className="form-input"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="contraseña" className="form-label">Contraseña</label>
            <input
              id="contraseña"
              name="contraseña"
              type="password"
              className="form-input"
              value={formData.contraseña}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn btn-primary">Iniciar sesión</button>
        </form>
      </div>
    </div>
  );
}