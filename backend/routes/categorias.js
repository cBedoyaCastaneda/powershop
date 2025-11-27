const express = require("express");
const router = express.Router();
const { Categoria, Producto } = require("../models");

/**
 * Route: GET /
 * Obtiene todas las categorías
 */
router.get('/', async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.status(200).json(categorias);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ 
      error: 'Error al obtener categorías',
      details: error.message 
    });
  }
});

/**
 * Route: GET /:id
 * Obtiene una categoría específica por ID con sus productos
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const categoria = await Categoria.findByPk(id, {
      include: [{
        model: Producto,
        attributes: ['id', 'nombre', 'precio', 'imagen', 'destacado']
      }]
    });

    if (!categoria) {
      return res.status(404).json({ error: `Categoría con ID ${id} no encontrada` });
    }

    res.status(200).json(categoria);
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    res.status(500).json({ 
      error: 'Error al obtener categoría',
      details: error.message 
    });
  }
});

/**
 * Route: POST /
 * Crea una nueva categoría
 * Requiere: { nombre, descripcion }
 */
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }

    const nuevaCategoria = await Categoria.create({
      nombre,
      descripcion: descripcion || null
    });

    res.status(201).json({ 
      message: 'Categoría creada exitosamente', 
      categoria: nuevaCategoria
    });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ 
      error: 'Error al crear categoría',
      details: error.message 
    });
  }
});

/**
 * Route: PUT /:id
 * Actualiza una categoría existente
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ error: `Categoría con ID ${id} no encontrada` });
    }

    await categoria.update({
      nombre: nombre || categoria.nombre,
      descripcion: descripcion !== undefined ? descripcion : categoria.descripcion
    });

    res.status(200).json({ 
      message: 'Categoría actualizada exitosamente', 
      categoria
    });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ 
      error: 'Error al actualizar categoría',
      details: error.message 
    });
  }
});

/**
 * Route: DELETE /:id
 * Elimina una categoría por ID
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ error: `Categoría con ID ${id} no encontrada` });
    }

    // Verificar si hay productos asociados
    const productosAsociados = await Producto.count({ where: { categoriaId: id } });
    
    if (productosAsociados > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar la categoría porque tiene productos asociados',
        productosCount: productosAsociados
      });
    }

    await categoria.destroy();

    res.status(200).json({ 
      message: 'Categoría eliminada exitosamente',
      id: parseInt(id)
    });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ 
      error: 'Error al eliminar categoría',
      details: error.message 
    });
  }
});

module.exports = router;