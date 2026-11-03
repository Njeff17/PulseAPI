process.env.JWT_SECRET = "test-secret";

const request = require("supertest");
const bcrypt = require("bcryptjs");
const app = require("../app");
const { sequelize, User } = require("../models");

async function setupDatabase() {
  await sequelize.sync({ force: true });

  await User.create({
    email: "technician@pulseapi.com",
    password: await bcrypt.hash("password123", 10),
  });
}

async function getToken() {
  const response = await request(app)
    .post("/login")
    .send({ email: "technician@pulseapi.com", password: "password123" });

  return response.body.token;
}

module.exports = { app, request, sequelize, setupDatabase, getToken };
