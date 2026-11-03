const express = require("express");
const { Device, Reading, Alert } = require("../models");

const router = express.Router({ mergeParams: true });

router.post("/", async function (req, res) {
  const device = await Device.findByPk(req.params.id);

  if (!device) {
    return res.status(404).json({ error: "Device not found" });
  }

  const voltage = req.body.voltage;

  if (!Number.isFinite(voltage)) {
    return res.status(400).json({ error: "Voltage must be a number" });
  }

  const reading = await Reading.create({
    deviceId: device.id,
    voltage: voltage,
  });

  if (voltage < 0 || voltage > 60) {
    await Alert.create({
      deviceId: device.id,
      voltage: voltage,
      timestamp: reading.timestamp,
    });
  }

  res.status(201).json(reading);
});

router.get("/", async function (req, res) {
  const device = await Device.findByPk(req.params.id);

  if (!device) {
    return res.status(404).json({ error: "Device not found" });
  }

  const readings = await Reading.findAll({
    where: { deviceId: device.id },
    order: [["timestamp", "ASC"]],
  });

  res.json(readings);
});

module.exports = router;
