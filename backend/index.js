require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());

// Crear conexión MySQL
const connection = require('./db');


// Probar conexión
connection.connect((err) => {
    if (err) {
        console.error("❌ Error conectando a MySQL:", err);
        return;
    }
    console.log("✅ Conectado a MySQL en Railway");
});

// Hacer la conexión accesible globalmente
global.db = connection;

// Importar rutas
const productosRoutes = require("./routes/products");

// Usar rutas
app.use("/", productosRoutes);

// Ejemplo de consulta
connection.query("SELECT NOW() AS fecha", (err, results) => {
    if (err) throw err;
    console.log("Resultado de ejemplo:", results[0]);
});

// Inicializar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});
