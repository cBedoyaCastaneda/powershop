const express = require("express");
const app = express();
const {Categoria,Producto,Usuario,Orden,OrdenProducto} = require("./models")
const sequelize = require("./database/database.js")
const cors = require("cors");

// Middlewares
app.use(cors()); // ✅ Esto habilita CORS
app.use(express.json());

// Middleware para parsear JSON
app.use(express.json());

// Importar rutas modulares
const categoriasRouters = require("./routes/categorias");
const ordenesRouters = require("./routes/ordenes");
const productosRouters = require("./routes/productos");
const usuariosRoutes = require("./routes/usuarios");

// Usar las rutas
app.use("/categorias", categoriasRouters);
app.use("/ordenes", ordenesRouters);
app.use("/productos", productosRouters);
app.use("/users", usuariosRoutes);

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