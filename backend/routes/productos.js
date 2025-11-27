const express = require("express");
const router = express.Router();
const { Producto, Categoria } = require("../models");

/**
 * Route: GET /
 * Obtiene todos los productos con su categoría asociada
 */
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: [{
        model: Categoria,
        attributes: ['id', 'nombre', 'descripcion']
      }]
    });

    res.status(200).json(productos);

  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ 
      error: 'Error al obtener productos',
      details: error.message 
    });
  }
});

/**
 * Route: GET /:id
 * Obtiene un producto específico por ID con su categoría
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const producto = await Producto.findByPk(id, {
      include: [{
        model: Categoria,
        attributes: ['id', 'nombre', 'descripcion']
      }]
    });

    if (!producto) {
      return res.status(404).json({ error: `Producto con ID ${id} no encontrado` });
    }

    res.status(200).json(producto);

  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ 
      error: 'Error al obtener producto',
      details: error.message 
    });
  }
});

/**
 * Route: POST /
 * Crea un nuevo producto
 * Requiere: { nombre, descripcion, precio, imagen, categoriaId, destacado }
 */
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, precio, imagen, categoriaId, destacado } = req.body;

    // Validación de campos requeridos
    if (!nombre || !precio || !categoriaId) {
      return res.status(400).json({ 
        error: 'Campos requeridos: nombre, precio y categoriaId' 
      });
    }

    // Verificar que la categoría existe
    const categoria = await Categoria.findByPk(categoriaId);
    if (!categoria) {
      return res.status(404).json({ 
        error: `Categoría con ID ${categoriaId} no encontrada` 
      });
    }

    // Crear el producto
    const nuevoProducto = await Producto.create({
      nombre,
      descripcion: descripcion || null,
      precio: parseFloat(precio),
      imagen: imagen || null,
      categoriaId,
      destacado: destacado || false
    });

    // Obtener el producto con su categoría
    const productoCompleto = await Producto.findByPk(nuevoProducto.id, {
      include: [{
        model: Categoria,
        attributes: ['id', 'nombre']
      }]
    });

    res.status(201).json({ 
      message: 'Producto creado exitosamente', 
      producto: productoCompleto
    });

  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ 
      error: 'Error al crear producto',
      details: error.message 
    });
  }
});

/**
 * Route: PUT /:id
 * Actualiza un producto existente
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, imagen, categoriaId, destacado } = req.body;

    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ error: `Producto con ID ${id} no encontrado` });
    }

    // Si se cambia la categoría, verificar que existe
    if (categoriaId && categoriaId !== producto.categoriaId) {
      const categoria = await Categoria.findByPk(categoriaId);
      if (!categoria) {
        return res.status(404).json({ 
          error: `Categoría con ID ${categoriaId} no encontrada` 
        });
      }
    }

    // Actualizar el producto
    await producto.update({
      nombre: nombre || producto.nombre,
      descripcion: descripcion !== undefined ? descripcion : producto.descripcion,
      precio: precio !== undefined ? parseFloat(precio) : producto.precio,
      imagen: imagen !== undefined ? imagen : producto.imagen,
      categoriaId: categoriaId || producto.categoriaId,
      destacado: destacado !== undefined ? destacado : producto.destacado
    });

    // Obtener el producto actualizado con su categoría
    const productoActualizado = await Producto.findByPk(id, {
      include: [{
        model: Categoria,
        attributes: ['id', 'nombre']
      }]
    });

    res.status(200).json({ 
      message: 'Producto actualizado exitosamente', 
      producto: productoActualizado
    });

  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ 
      error: 'Error al actualizar producto',
      details: error.message 
    });
  }
});

/**
 * Route: DELETE /:id
 * Elimina un producto por ID
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ error: `Producto con ID ${id} no encontrado` });
    }

    await producto.destroy();

    res.status(200).json({ 
      message: 'Producto eliminado exitosamente',
      id: parseInt(id)
    });

  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ 
      error: 'Error al eliminar producto',
      details: error.message 
    });
  }
});

module.exports = router;