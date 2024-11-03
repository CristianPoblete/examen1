const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'en-proceso', 'completada'],
    default: 'pendiente'
  },
  fechaLimite: {
    type: Date,
    required: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Task', TaskSchema);