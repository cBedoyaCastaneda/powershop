const express = require("express");
const router = express.Router();
const { Producto, Categoria } = require("../models");

/**
 * Route: POST /
 * Creates a new product.
 * Requires: { nombre, descripcion, precio, categoriaId, destacado } in the request body.
 */
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoriaId, destacado } = req.body;

    // Basic input validation
    if (!nombre || !precio || !categoriaId || !destacado) {
      return res.status(400).json({ error: 'Missing required fields: nombre, precio, and categoriaId.' });
    }

    // Check if category exists
    const categoria = await Categoria.findByPk(categoriaId);
    if (!categoria) {
      return res.status(404).json({ error: `Category with ID ${categoriaId} not found.` });
    }

    // Create the new product
    const nuevoProducto = await Producto.create({
      nombre,
      descripcion: descripcion || 'No description provided',
      precio: parseFloat(precio),
      categoriaId,
      destacado
    });

    // Success response
    res.status(201).json({ 
      message: 'Product created successfully', 
      producto: nuevoProducto 
    });

  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ 
      error: 'Internal server error while creating product.',
      details: error.message 
    });
  }
});

/**
 * Route: GET /
 * Retrieves all products. Includes their category (eager loading).
 */
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.findAll({
      // Include the associated Category data
      include: [{
        model: Categoria,
        as: 'categoria',
        attributes: ['id', 'nombre'] // Select only relevant category fields
      }],
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    res.status(200).json(productos);

  } catch (error) {
    console.error('Error retrieving all products:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching products.',
      details: error.message 
    });
  }
});

/**
 * Route: GET /:id
 * Retrieves a single product by ID.
 */
router.get('/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const producto = await Producto.findByPk(productId, {
      // Include the associated Category data
      include: [{
        model: Categoria,
        as: 'categoria',
        attributes: ['id', 'nombre', 'descripcion'] 
      }],
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    if (!producto) {
      return res.status(404).json({ error: `Product with ID ${productId} not found.` });
    }

    res.status(200).json(producto);

  } catch (error) {
    console.error('Error retrieving product by ID:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching product.',
      details: error.message 
    });
  }
});

/**
 * Route: DELETE /:id
 * Deletes a product by ID.
 */
router.delete('/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    // Find the product to ensure it exists before attempting delete
    const producto = await Producto.findByPk(productId);
    if (!producto) {
      return res.status(404).json({ error: `Product with ID ${productId} not found.` });
    }

    // Perform the deletion
    await producto.destroy();

    // Success response (200 OK or 204 No Content are common for successful deletion)
    res.status(200).json({ 
      message: `Product with ID ${productId} deleted successfully.`,
      deletedProduct: producto
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ 
      error: 'Internal server error while deleting product.',
      details: error.message 
    });
  }
});
