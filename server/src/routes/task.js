const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// Obtener todas las tareas del usuario
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ usuario: req.user.id }).sort({ fechaCreacion: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Crear una nueva tarea
router.post('/', auth, async (req, res) => {
  const { titulo, descripcion, fechaLimite } = req.body;

  try {
    const newTask = new Task({
      titulo,
      descripcion,
      fechaLimite,
      usuario: req.user.id
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Actualizar una tarea
router.put('/:id', auth, async (req, res) => {
  const { titulo, descripcion, estado, fechaLimite } = req.body;

  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Tarea no encontrada' });

    // Verificar que el usuario es dueño de la tarea
    if (task.usuario.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'No autorizado' });
    }

    task.titulo = titulo;
    task.descripcion = descripcion;
    task.estado = estado;
    task.fechaLimite = fechaLimite;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Eliminar una tarea
router.delete('/:id', auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Tarea no encontrada' });

    // Verificar que el usuario es dueño de la tarea
    if (task.usuario.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'No autorizado' });
    }

    await Task.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Tarea eliminada' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;