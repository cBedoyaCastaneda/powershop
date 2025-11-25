const express = require("express");
const router = express.Router();

// GET /productos/:id
router.get("/productos/:id", (req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM productos WHERE id = ?";
    global.db.query(sql, [id], (err, results) => {
        if (err) {
            console.log("❌ Error en consulta:", err);
            return res.status(500).json({ error: "Error en el servidor" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json(results[0]);
    });
});

module.exports = router;
