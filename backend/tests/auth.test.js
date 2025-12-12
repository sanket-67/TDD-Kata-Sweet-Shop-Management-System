import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import User from "../src/models/user.model.js";

beforeAll(async () => {
  // set secret for jwt during tests
  process.env.JWT_SECRET = "testsecret";
  await connectDB();
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth: Register User", () => {
  it("should return 201 when registering a user", async () => {

    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Sanket",
        email: "sanket@example.com",
        password: "secret123"
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data.user).toHaveProperty("email", "sanket@example.com");
  });
});
