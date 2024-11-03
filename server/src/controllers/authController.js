const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { nombre, apellido, correo, contraseña } = req.body;
    let user = await User.findOne({ correo });
    if (user) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }
    user = new User({ nombre, apellido, correo, contraseña });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
};

exports.login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    const user = await User.findOne({ correo });
    if (!user) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }
    const isMatch = await user.comparePassword(contraseña);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
};