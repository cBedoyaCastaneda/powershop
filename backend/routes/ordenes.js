const express = require('express');
const router = express.Router();
const { Orden, Usuario, Producto, OrdenProducto, sequelize } = require("./../models");

/**
 * Route: POST /
 * Crea una nueva orden, incluyendo los productos y sus cantidades.
 * Requiere: { usuarioId: number, items: [{ productoId: number, cantidad: number }] }
 * NOTA: La lógica de cálculo de precio total se simplifica aquí. En producción, 
 * se debe verificar el stock y calcular el precio desde la DB.
 */
router.post('/', async (req, res) => {
  const t = await sequelize.transaction(); // Iniciar transacción
  try {
    const { usuarioId, items } = req.body;

    // 1. Validación básica
    if (!usuarioId || !items || items.length === 0) {
      await t.rollback();
      return res.status(400).json({ error: 'El ID de usuario y el array de items son obligatorios.' });
    }

    // 2. Crear la Orden principal
    const nuevaOrden = await Orden.create({ 
      usuarioId,
      // Se asume un total inicial, luego podría ser calculado en otra capa
      totalConIGV: 0.00 
    }, { transaction: t });

    // 3. Preparar los registros para la tabla pivote OrdenProducto
    const orderItems = items.map(item => ({
      ordenId: nuevaOrden.id,
      productoId: item.productoId,
      cantidad: item.cantidad
    }));

    // 4. Crear los registros de la tabla pivote en bulk
    await OrdenProducto.bulkCreate(orderItems, { transaction: t });

    // 5. Opcional: Calcular y actualizar el total (Requiere un join con Producto para obtener el precio)

    await t.commit(); // Confirmar la transacción

    // 6. Obtener la orden recién creada con sus productos asociados para la respuesta
    const ordenCompleta = await Orden.findByPk(nuevaOrden.id, {
        include: [
            { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] },
            { 
                model: Producto, 
                as: 'productos', 
                attributes: ['id', 'nombre', 'precio'],
                through: { attributes: ['cantidad'] } // Incluir la cantidad de la tabla pivote
            }
        ]
    });

    res.status(201).json({ 
      message: 'Orden creada exitosamente con productos asociados.', 
      orden: ordenCompleta 
    });

  } catch (error) {
    await t.rollback(); // Deshacer si algo falla
    console.error('Error creando orden:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor al crear la orden.',
      details: error.message 
    });
  }
});

/**
 * Route: GET /
 * Obtiene todas las órdenes, incluyendo el usuario y los productos asociados.
 */
router.get('/', async (req, res) => {
  try {
    const ordenes = await Orden.findAll({
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombre'] },
        { 
            model: Producto, 
            as: 'productos', 
            attributes: ['id', 'nombre', 'precio'],
            through: { attributes: ['cantidad'] } // Incluir la cantidad
        }
      ],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['fecha', 'DESC']]
    });

    res.status(200).json(ordenes);

  } catch (error) {
    console.error('Error al obtener todas las órdenes:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor al buscar órdenes.',
      details: error.message 
    });
  }
});

/**
 * Route: GET /:id
 * Obtiene una orden individual por ID.
 */
router.get('/:id', async (req, res) => {
  const ordenId = req.params.id;

  try {
    const orden = await Orden.findByPk(ordenId, {
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] },
        { 
            model: Producto, 
            as: 'productos', 
            attributes: ['id', 'nombre', 'precio'],
            through: { attributes: ['cantidad'] } // Incluir la cantidad
        }
      ],
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    if (!orden) {
      return res.status(404).json({ error: `Orden con ID ${ordenId} no encontrada.` });
    }

    res.status(200).json(orden);

  } catch (error) {
    console.error('Error al obtener orden por ID:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor al buscar orden.',
      details: error.message 
    });
  }
});

/**
 * Route: DELETE /:id
 * Elimina una orden por ID.
 * Al eliminar la orden, los registros asociados en OrdenProducto deben eliminarse 
 * automáticamente si se configuró onDelete: 'CASCADE' en las asociaciones de las migraciones/modelos.
 * Como usamos sync({force: true}), Sequelize aplica CASCADE por defecto a muchos-a-muchos.
 */
router.delete('/:id', async (req, res) => {
  const ordenId = req.params.id;

  try {
    const deleteCount = await Orden.destroy({
      where: { id: ordenId }
    });

    if (deleteCount === 0) {
      return res.status(404).json({ error: `Orden con ID ${ordenId} no encontrada.` });
    }

    res.status(200).json({ 
      message: `Orden con ID ${ordenId} y sus productos asociados eliminados exitosamente.`,
    });

  } catch (error) {
    console.error('Error eliminando orden:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor al eliminar la orden.',
      details: error.message 
    });
  }
});

module.exports = router;