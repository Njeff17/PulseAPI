const express = require("express");
const { Alert } = require("../models");

const router = express.Router();

router.get("/", async function (req, res) {
  const alerts = await Alert.findAll();
  res.json(alerts);
});

router.delete("/:id", async function (req, res) {
  const alert = await Alert.findByPk(req.params.id);

  if (!alert) {
    return res.status(404).json({ error: "Alert not found" });
  }

  await alert.destroy();
  res.status(204).send();
});

module.exports = router;
