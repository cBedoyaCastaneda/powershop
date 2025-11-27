const express = require('express');
const router = express.Router();
const { Categoria, Producto } = require('../database');;

/**
 * Route: POST /
 * Crea una nueva categoría.
 * Requiere: { nombre, descripcion } en el cuerpo de la solicitud.
 */
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    // Validación básica
    if (!nombre) {
      return res.status(400).json({ error: 'El campo "nombre" es obligatorio para crear una categoría.' });
    }

    // Creación de la nueva categoría
    const nuevaCategoria = await Categoria.create({
      nombre,
      descripcion: descripcion || 'Sin descripción',
    });

    // Respuesta exitosa
    res.status(201).json({ 
      message: 'Categoría creada exitosamente', 
      categoria: nuevaCategoria 
    });

  } catch (error) {
    // Manejo de errores de base de datos (ej. nombre duplicado)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: `La categoría con nombre "${req.body.nombre}" ya existe.` });
    }
    console.error('Error creando categoría:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor al crear la categoría.',
      details: error.message 
    });
  }
});

/**
 * Route: GET /
 * Obtiene todas las categorías. Incluye la cuenta de productos asociados.
 */
router.get('/', async (req, res) => {
  try {
    const categorias = await Categoria.findAll({
      // Se pueden incluir los productos asociados usando Eager Loading
      include: [{
        model: Producto,
        as: 'productos',
        attributes: ['id', 'nombre', 'precio'], // Seleccionamos solo campos relevantes
        required: false // LEFT JOIN: incluye categorías incluso si no tienen productos
      }],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['nombre', 'ASC']]
    });

    res.status(200).json(categorias);

  } catch (error) {
    console.error('Error al obtener todas las categorías:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor al buscar categorías.',
      details: error.message 
    });
  }
});

/**
 * Route: GET /:id
 * Obtiene una categoría individual por ID.
 */
router.get('/:id', async (req, res) => {
  const categoryId = req.params.id;

  try {
    const categoria = await Categoria.findByPk(categoryId, {
      include: [{
        model: Producto,
        as: 'productos',
        attributes: ['id', 'nombre', 'precio'] 
      }],
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    if (!categoria) {
      return res.status(404).json({ error: `Categoría con ID ${categoryId} no encontrada.` });
    }

    res.status(200).json(categoria);

  } catch (error) {
    console.error('Error al obtener categoría por ID:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor al buscar categoría.',
      details: error.message 
    });
  }
});

/**
 * Route: DELETE /:id
 * Elimina una categoría por ID.
 * NOTA: Sequelize maneja por defecto la eliminación en cascada si se configuró en la migración.
 * Si hay productos asociados, la eliminación podría fallar dependiendo de las restricciones FK de la DB.
 */
router.delete('/:id', async (req, res) => {
  const categoryId = req.params.id;

  try {
    const categoria = await Categoria.findByPk(categoryId);
    if (!categoria) {
      return res.status(404).json({ error: `Categoría con ID ${categoryId} no encontrada.` });
    }

    // Se realiza la eliminación
    const deleteCount = await Categoria.destroy({
      where: { id: categoryId }
    });

    if (deleteCount === 0) {
      return res.status(404).json({ error: `Categoría con ID ${categoryId} no encontrada.` });
    }

    // Respuesta exitosa (200 OK)
    res.status(200).json({ 
      message: `Categoría con ID ${categoryId} eliminada exitosamente.`,
      deletedCategory: categoria.nombre
    });

  } catch (error) {
    console.error('Error eliminando categoría:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor al eliminar la categoría. Revise si hay productos asociados.',
      details: error.message 
    });
  }
});

module.exports = router;