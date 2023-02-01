const { Sequelize } = require("sequelize");
require('dotenv').config();

// with sampp
// Option 3: Passing parameters separately (other dialects)
// const sequelize = new Sequelize("booking-care", "root", null, {
//   host: "localhost",
//   dialect: "mysql",
//   // define: {
//   //   freezeTableName: true,
//   // },
//   logging: false,
// });

// with pgAdmin
const sequelize = new Sequelize(
  process.env.DB_DATABASE_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    dialectOptions:
    process.env.DB_SSL === 'true' ? {
      ss1: {
        require: true,
        rejectUnauthorized: false
      } 
    } : {},
    query: {
      "raw": true
    },
    timezone: '+07:00'
  },
)

let connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = connectDB;
