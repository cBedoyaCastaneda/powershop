const express = require("express");
const app = express();
const {Categoria,Producto,Usuario,Orden,OrdenProducto} = require("./models")
const sequelize = require("./database/database.js")

// Middleware para parsear JSON
app.use(express.json());

// Importar rutas modulares
const usuariosRoutes = require("./routes/usuarios");

// Usar las rutas
app.use("/users", usuariosRoutes);

// CATEGORIES
app.get("/categories", async (req, res) => {
  const data = await Categoria.findAll();
  res.json(data);
});

app.post("/categories", async (req, res) => {
  const newCategory = await Categoria.create(req.body);
  res.json(newCategory);
});

// PRODUCTS
app.get("/products", async (req, res) => {
  const data = await Producto.findAll({
    include: Categoria // para traer categoría
  });
  res.json(data);
});

app.post("/products", async (req, res) => {
  const newProduct = await Producto.create(req.body);
  res.json(newProduct);
});

// Ordenes
app.get("/ordenes", async (req, res) => {
  try {
    const ordenes = await Orden.findAll({
      include: [
        {
          model: Producto,
          through: {
            attributes: ['cantidad']   // Muestra la cantidad en la relación
          }
        }
      ]
    });

    res.json(ordenes);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.post("/ordenes", async (req, res) => {
  try {
    const { usuarioId, fecha, productos } = req.body;

    // 1. Crear la orden sin totales aún
    const nuevaOrden = await Orden.create({
      usuarioId,
      fecha,
      totalSinIGV: 0,
      totalConIGV: 0
    });

    // 2. Crear los productos asociados
    let total = 0;

    for (const item of productos) {
      await OrdenProducto.create({
        ordenId: nuevaOrden.id,
        productoId: item.productoId,
        cantidad: item.cantidad
      });

      // Calcular total (requiere precio del producto)
      const producto = await Producto.findByPk(item.productoId);
      total += producto.precio * item.cantidad;
    }

    const sinIGV = total;
    const conIGV = total * 1.18;

    // 3. Actualizar totales
    await nuevaOrden.update({
      totalSinIGV: sinIGV,
      totalConIGV: conIGV
    });

    res.json({
      message: 'Orden creada correctamente',
      orden: nuevaOrden
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

// INICIO 
async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // crea tablas si no existen
    console.log("Conectado a PostgreSQL");

    app.listen(3000, () => console.log("Servidor en puerto 3000"));
  } catch (err) {
    console.error("Error:", err);
  }
}

start();