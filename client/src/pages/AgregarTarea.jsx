import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AgregarTarea() {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fechaLimite: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es requerido';
    }
    if (formData.descripcion.length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }
    if (!formData.fechaLimite) {
      newErrors.fechaLimite = 'La fecha límite es requerida';
    } else {
      const fechaLimite = new Date(formData.fechaLimite);
      const hoy = new Date();
      if (fechaLimite <= 

 hoy) {
        newErrors.fechaLimite = 'La fecha límite debe ser una fecha futura';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/tasks', formData, {
          headers: { 'x-auth-token': token }
        });
        navigate('/bienvenida');
      } catch (error) {
        setErrors(prev => ({...prev, submit: 'Error al crear la tarea'}));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Agregar tarea</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="titulo" className="form-label">Título</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className="form-input"
            />
            {errors.titulo && <p className="error-message">{errors.titulo}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="descripcion" className="form-label">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="form-input"
              rows="3"
            ></textarea>
            {errors.descripcion && <p className="error-message">{errors.descripcion}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="fechaLimite" className="form-label">Fecha límite</label>
            <input
              type="date"
              id="fechaLimite"
              name="fechaLimite"
              value={formData.fechaLimite}
              onChange={handleChange}
              className="form-input"
            />
            {errors.fechaLimite && <p className="error-message">{errors.fechaLimite}</p>}
          </div>
          {errors.submit && <p className="error-message">{errors.submit}</p>}
          <button type="submit" className="btn btn-primary">Agregar</button>
        </form>
      </div>
    </div>
  );
}