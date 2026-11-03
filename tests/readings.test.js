const {
  app,
  request,
  sequelize,
  setupDatabase,
  getToken,
} = require("./helpers");

let token;
let deviceId;

beforeAll(async function () {
  await setupDatabase();
  token = await getToken();

  const device = await request(app)
    .post("/api/devices")
    .set("Authorization", "Bearer " + token)
    .send({ name: "Pump A", serialNumber: "SN-001" });

  deviceId = device.body.id;
});

afterAll(() => sequelize.close());

test("test submitting a reading of 75 V creates an alert", async function () {
  const response = await request(app)
    .post("/api/devices/" + deviceId + "/readings")
    .set("Authorization", "Bearer " + token)
    .send({ voltage: 75 });

  expect(response.status).toBe(201);

  const alerts = await request(app)
    .get("/api/alerts")
    .set("Authorization", "Bearer " + token);

  expect(alerts.body.length).toBe(1);
  expect(alerts.body[0].deviceId).toBe(deviceId);
  expect(alerts.body[0].voltage).toBe(75);
});

test("test submitting a reading with a text value returns 400", async function () {
  const response = await request(app)
    .post("/api/devices/" + deviceId + "/readings")
    .set("Authorization", "Bearer " + token)
    .send({ voltage: "abc" });

  expect(response.status).toBe(400);
  expect(response.body.error).toBe("Voltage must be a number");
});
