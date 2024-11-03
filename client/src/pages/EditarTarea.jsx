import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditarTarea() {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fechaLimite: '',
    estado: ''
  });
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTarea = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/tasks/${id}`, {
          headers: { 'x-auth-token': token }
        });
        const tarea = response.data;
        setFormData({
          titulo: tarea.titulo,
          descripcion: tarea.descripcion,
          fechaLimite: tarea.fechaLimite.split('T')[0],
          estado: tarea.estado
        });
      } catch (error) {
        console.error('Error al obtener la tarea:', error);
      }
    };
    fetchTarea();
  }, [id]);

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
      if (fechaLimite <= hoy) {
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
        await axios.put(`http://localhost:5000/api/tasks/${id}`, formData, {
          headers: { 'x-auth-token': token }
        });
        navigate('/bienvenida');
      } catch (error) {
        setErrors(prev => ({...prev, submit: 'Error al actualizar la tarea'}));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
          headers: { 'x-auth-token': token }
        });
        navigate('/bienvenida');
      } catch (error) {
        setErrors(prev => ({...prev, submit: 'Error al eliminar la tarea'}));
      }
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Editar tarea</h2>
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
          <div className="form-group">
            <label htmlFor="estado" className="form-label">Estado</label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="form-input"
            >
              <option value="pendiente">Pendiente</option>
              <option value="en-proceso">En proceso</option>
              <option value="completada">Completada</option>
            </select>
          </div>
          {errors.submit && <p className="error-message">{errors.submit}</p>}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Actualizar</button>
            <button type="button" onClick={handleDelete} className="btn btn-danger">Eliminar tarea</button>
          </div>
        </form>
      </div>
    </div>
  );
}