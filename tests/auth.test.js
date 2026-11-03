const { app, request, sequelize, setupDatabase } = require("./helpers");

beforeAll(setupDatabase);
afterAll(() => sequelize.close());

test("test login with correct credentials returns a token", async function () {
  const response = await request(app)
    .post("/login")
    .send({ email: "technician@pulseapi.com", password: "password123" });

  expect(response.status).toBe(200);
  expect(typeof response.body.token).toBe("string");
});

test("test login with wrong password returns 401", async function () {
  const response = await request(app)
    .post("/login")
    .send({ email: "technician@pulseapi.com", password: "wrongpassword" });

  expect(response.status).toBe(401);
  expect(response.body.error).toBe("Invalid email or password");
});

test("test accessing a protected endpoint without a token returns 401", async function () {
  const response = await request(app).get("/api/devices");

  expect(response.status).toBe(401);
  expect(response.body.error).toBe("Missing token");
});
