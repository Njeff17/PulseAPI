const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/config.json").development;

const sequelize = new Sequelize(config);

const User = require("./user")(sequelize, DataTypes);

module.exports = { sequelize, User };
