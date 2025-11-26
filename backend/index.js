const express = require("express");
const app = express();
const sequelize = require("./database.js")
const User = require("./models/user.js")
const Category = require("./models/category.js")
const Product = require("./models/product.js")

// USERS
app.get("/users", async (req, res) => {
  const data = await User.findAll();
  res.json(data);
});

app.post("/users", async (req, res) => {
  const newUser = await User.create(req.body);
  res.json(newUser);
});

// CATEGORIES
app.get("/categories", async (req, res) => {
  const data = await Category.findAll();
  res.json(data);
});

app.post("/categories", async (req, res) => {
  const newCategory = await Category.create(req.body);
  res.json(newCategory);
});

// PRODUCTS
app.get("/products", async (req, res) => {
  const data = await Product.findAll({
    include: Category // para traer categoría
  });
  res.json(data);
});

app.post("/products", async (req, res) => {
  const newProduct = await Product.create(req.body);
  res.json(newProduct);
});

// ------------------------ INICIO -------------------------
async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // crea tablas si no existen
    console.log("Conectado a MySQL");

    app.listen(3000, () => console.log("Servidor en puerto 3000"));
  } catch (err) {
    console.error("Error:", err);
  }
}

start();
