import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    contraseña: '',
    confirmarContraseña: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { register } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre || formData.nombre.length < 3) {
      newErrors.nombre = 'Por favor proporciona tu nombre';
    }

    if (!formData.apellido || formData.apellido.length < 3) {
      newErrors.apellido = 'Por favor proporciona tu apellido';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo || !emailRegex.test(formData.correo)) {
      newErrors.correo = 'Por favor ingresa un correo válido';
    }

    if (!formData.contraseña || formData.contraseña.length < 8) {
      newErrors.contraseña = 'La contraseña necesita tener al menos 8 caracteres';
    }

    if (formData.contraseña !== formData.confirmarContraseña) {
      newErrors.confirmarContraseña = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await register(formData.nombre, formData.apellido, formData.correo, formData.contraseña);
      navigate('/login');
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: 'Error al registrar el usuario'
      }));
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
        <h2>Registro</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              className="form-input"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            {errors.nombre && <p className="error-message">{errors.nombre}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="apellido" className="form-label">Apellido</label>
            <input
              id="apellido"
              name="apellido"
              type="text"
              className="form-input"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
            {errors.apellido && <p className="error-message">{errors.apellido}</p>}
          </div>
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
            {errors.correo && <p className="error-message">{errors.correo}</p>}
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
            {errors.contraseña && <p className="error-message">{errors.contraseña}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmarContraseña" className="form-label">Confirmar contraseña</label>
            <input
              id="confirmarContraseña"
              name="confirmarContraseña"
              type="password"
              className="form-input"
              value={formData.confirmarContraseña}
              onChange={handleChange}
              required
            />
            {errors.confirmarContraseña && <p className="error-message">{errors.confirmarContraseña}</p>}
          </div>
          {errors.submit && <p className="error-message">{errors.submit}</p>}
          <button type="submit" className="btn btn-primary">Registrarse</button>
        </form>
      </div>
    </div>
  );
}