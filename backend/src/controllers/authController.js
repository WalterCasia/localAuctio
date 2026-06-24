const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_temporario', {
        expiresIn: '30d'
    });
};

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { nombre, email, password, rol_preferido } = req.body;

        if (!nombre || !email || !password || !rol_preferido) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const user = await User.create({
            nombre,
            email,
            password,
            rol_preferido
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                nombre: user.nombre,
                email: user.email,
                rol_preferido: user.rol_preferido,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Datos de usuario inválidos' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Autenticar usuario y obtener token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                nombre: user.nombre,
                email: user.email,
                rol_preferido: user.rol_preferido,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Email o contraseña inválidos' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login };
