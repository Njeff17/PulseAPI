const express = require("express");
const { Sequelize } = require("sequelize");

const app = express();
const PORT = 3000;

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "pulse.db",
  logging: false,
});

app.use(express.json());

app.get("/health", function (req, res) {
  res.json({ status: "ok", message: "PulseAPI is running" });
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Connected to the database.");

    app.listen(PORT, function () {
      console.log("PulseAPI is running at http://localhost:" + PORT);
    });
  } catch (error) {
    console.error("Could not connect to the database:", error.message);
  }
}

startServer();
