const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ usuario: req.user.id });
    res.json(tasks);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
};

exports.createTask = async (req, res) => {
  try {
    const { titulo, descripcion, fechaLimite } = req.body;
    const newTask = new Task({
      titulo,
      descripcion,
      fechaLimite,
      usuario: req.user.id,
    });
    const task = await newTask.save();
    res.json(task);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { titulo, descripcion, estado, fechaLimite } = req.body;
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Tarea no encontrada' });
    if (task.usuario.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'No autorizado' });
    }
    task = await Task.findByIdAndUpdate(
      req.params.id,
      { titulo, descripcion, estado, fechaLimite },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
};

exports.deleteTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Tarea no encontrada' });
    if (task.usuario.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'No autorizado' });
    }
    await Task.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Tarea eliminada' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
};