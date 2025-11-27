const Sequelize = require('sequelize');
const dontenv = require("dotenv")

dontenv.config()

const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD,
{
    host: process.env.PGHOST,
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
})

module.exports = sequelize