const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Usuario } = require("./../models");

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password'] } // No devolver contraseñas
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar un nuevo usuario con encriptación de contraseña
router.post("/", async (req, res) => {
  try {
    const { nombre, apellido, usuario, email, password, direccion, esAdmin } = req.body;

    // Validar que los campos requeridos existan
    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son requeridos" });
    }

    // Verificar si el email ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    // Encriptar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear el usuario con la contraseña encriptada
    const nuevoUsuario = await Usuario.create({
      nombre: nombre || null,
      apellido: apellido || null,
      usuario: usuario || null,
      email: email,
      password: hashedPassword,
      direccion: direccion || "Ca. Paraguay",
      esAdmin: esAdmin || false
    });

    // Devolver usuario sin la contraseña
    const usuarioRespuesta = { ...nuevoUsuario.toJSON() };
    delete usuarioRespuesta.password;

    res.status(201).json(usuarioRespuesta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login endpoint - Validar credenciales
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son requeridos" });
    }

    // Buscar usuario por email
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // Comparar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // Devolver usuario sin contraseña
    const usuarioRespuesta = { ...usuario.toJSON() };
    delete usuarioRespuesta.password;

    res.json(usuarioRespuesta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un usuario por ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    await usuario.destroy();
    res.json({ message: "Usuario eliminado correctamente", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;