const express = require("express");
const { ValidationError } = require("sequelize");
const requireAuth = require("./middleware/requireAuth");
const authRoutes = require("./routes/auth");
const deviceRoutes = require("./routes/devices");
const readingRoutes = require("./routes/readings");
const alertRoutes = require("./routes/alerts");

const app = express();
const PORT = 3000;

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing. Copy .env.example to .env");
  process.exit(1);
}

app.use(express.json());

app.use(function (req, res, next) {
  req.body = req.body || {};
  next();
});

app.use(authRoutes);
app.use("/api/devices", requireAuth, deviceRoutes);
app.use("/api/devices/:id/readings", requireAuth, readingRoutes);
app.use("/api/alerts", requireAuth, alertRoutes);

app.use(function (req, res) {
  res.status(404).json({ error: "Route not found" });
});

app.use(function (err, req, res, next) {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.errors[0].message });
  }

  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(PORT, function () {
  console.log("PulseAPI is running at http://localhost:" + PORT);
});
