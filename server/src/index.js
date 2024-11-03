require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const cors = require('cors');

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));