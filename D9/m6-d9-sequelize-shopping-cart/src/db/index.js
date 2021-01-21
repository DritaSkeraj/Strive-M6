const { Sequelize, DataTypes } = require("sequelize");
const User = require("./user");
const Category = require("./category");
const Product = require("./product");
const Cart = require("./cart");
const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: "postgres",
  }
);

const models = {
  User: User(sequelize, DataTypes),
  Category: Category(sequelize, DataTypes),
  Product: Product(sequelize, DataTypes),
  Cart: Cart(sequelize, DataTypes),
};

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

sequelize
  .authenticate()
  .then(() => console.log("Connection established"))
  .catch((e) => console.log("Connection failed ", e));

module.exports = models;
