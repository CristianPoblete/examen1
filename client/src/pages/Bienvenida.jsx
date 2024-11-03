import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export default function Bienvenida() {
  const [tareas, setTareas] = useState({
    pendientes: [],
    enProceso: [],
    completadas: []
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/tasks', {
          headers: { 'x-auth-token': token }
        });
        const tareasOrganizadas = response.data.reduce((acc, tarea) => {
          if (tarea.estado === 'pendiente') acc.pendientes.push(tarea);
          else if (tarea.estado === 'en-proceso') acc.enProceso.push(tarea);
          else if (tarea.estado === 'completada') acc.completadas.push(tarea);
          return acc;
        }, { pendientes: [], enProceso: [], completadas: [] });
        setTareas(tareasOrganizadas);
      } catch (error) {
        console.error('Error al obtener las tareas:', error);
      }
    };

    fetchTareas();
  }, []);

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/tasks/${id}`, { estado: nuevoEstado }, {
        headers: { 'x-auth-token': token }
      });
      // Actualizar el estado local
      setTareas(prev => {
        const todasLasTareas = [...prev.pendientes, ...prev.enProceso, ...prev.completadas];
        const tareaActualizada = todasLasTareas.find(t => t._id === id);
        tareaActualizada.estado = nuevoEstado;
        
        return {
          pendientes: todasLasTareas.filter(t => t.estado === 'pendiente'),
          enProceso: todasLasTareas.filter(t => t.estado === 'en-proceso'),
          completadas: todasLasTareas.filter(t => t.estado === 'completada')
        };
      });
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
    }
  };

  return (
    <div className="container">
      <h1>Bienvenido de vuelta {user?.nombre} {user?.apellido}</h1>
      <Link to="/agregar-tarea" className="btn btn-primary">Agregar Tarea</Link>
      <div className="task-grid">
        <div>
          <h2>Tareas pendientes</h2>
          {tareas.pendientes.map(tarea => (
            <div key={tarea._id} className="task-card">
              <div className="task-card-header">
                <h3 className="task-card-title">{tarea.titulo}</h3>
                <span className="task-status status-pending">Pendiente</span>
              </div>
              <p>{tarea.descripcion}</p>
              <div className="task-card-actions">
                <button 
                  onClick={() => handleEstadoChange(tarea._id, 'en-proceso')}
                  className="btn btn-primary"
                >
                  Comenzar tarea
                </button>
                <Link to={`/editar-tarea/${tarea._id}`} className="btn">Editar</Link>
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2>Tareas en proceso</h2>
          {tareas.enProceso.map(tarea => (
            <div key={tarea._id} className="task-card">
              <div className="task-card-header">
                <h3 className="task-card-title">{tarea.titulo}</h3>
                <span className="task-status status-in-progress">En proceso</span>
              </div>
              <p>{tarea.descripcion}</p>
              <div className="task-card-actions">
                <button 
                  onClick={() => handleEstadoChange(tarea._id, 'completada')}
                  className="btn btn-primary"
                >
                  Completar
                </button>
                <Link to={`/editar-tarea/${tarea._id}`} className="btn">Editar</Link>
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2>Tareas completadas</h2>
          {tareas.completadas.map(tarea => (
            <div key={tarea._id} className="task-card">
              <div className="task-card-header">
                <h3 className="task-card-title">{tarea.titulo}</h3>
                <span className="task-status status-completed">Completada</span>
              </div>
              <p>{tarea.descripcion}</p>
              <div className="task-card-actions">
                <Link to={`/editar-tarea/${tarea._id}`} className="btn">Editar</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}