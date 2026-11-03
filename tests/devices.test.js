const {
  app,
  request,
  sequelize,
  setupDatabase,
  getToken,
} = require("./helpers");
const { Reading } = require("../models");

let token;

beforeAll(async function () {
  await setupDatabase();
  token = await getToken();
});

afterAll(() => sequelize.close());

test("test creating a device with valid data returns 201 and the device details", async function () {
  const response = await request(app)
    .post("/api/devices")
    .set("Authorization", "Bearer " + token)
    .send({ name: "Pump A", serialNumber: "SN-001", location: "Kigali" });

  expect(response.status).toBe(201);
  expect(response.body.id).toBeDefined();
  expect(response.body.name).toBe("Pump A");
  expect(response.body.serialNumber).toBe("SN-001");
  expect(response.body.location).toBe("Kigali");
});

test("test creating a device without a name returns 400", async function () {
  const response = await request(app)
    .post("/api/devices")
    .set("Authorization", "Bearer " + token)
    .send({ serialNumber: "SN-002" });

  expect(response.status).toBe(400);
  expect(response.body.error).toBe("Name and serial number are required");
});

test("test creating two devices with the same serial number returns an error", async function () {
  await request(app)
    .post("/api/devices")
    .set("Authorization", "Bearer " + token)
    .send({ name: "Pump B", serialNumber: "SN-003" });

  const response = await request(app)
    .post("/api/devices")
    .set("Authorization", "Bearer " + token)
    .send({ name: "Pump C", serialNumber: "SN-003" });

  expect(response.status).toBe(409);
  expect(response.body.error).toBe("Serial number already exists");
});

test("test fetching a device that does not exist returns 404", async function () {
  const response = await request(app)
    .get("/api/devices/9999")
    .set("Authorization", "Bearer " + token);

  expect(response.status).toBe(404);
  expect(response.body.error).toBe("Device not found");
});

test("test deleting a device also removes its readings", async function () {
  const device = await request(app)
    .post("/api/devices")
    .set("Authorization", "Bearer " + token)
    .send({ name: "Pump D", serialNumber: "SN-004" });

  const deviceId = device.body.id;

  await request(app)
    .post("/api/devices/" + deviceId + "/readings")
    .set("Authorization", "Bearer " + token)
    .send({ voltage: 12 });

  await request(app)
    .post("/api/devices/" + deviceId + "/readings")
    .set("Authorization", "Bearer " + token)
    .send({ voltage: 30 });

  expect(await Reading.count({ where: { deviceId: deviceId } })).toBe(2);

  const response = await request(app)
    .delete("/api/devices/" + deviceId)
    .set("Authorization", "Bearer " + token);

  expect(response.status).toBe(204);
  expect(await Reading.count({ where: { deviceId: deviceId } })).toBe(0);
});
