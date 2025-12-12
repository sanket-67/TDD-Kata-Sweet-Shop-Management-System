import request from "supertest";
import app from "../src/app.js";

describe("Auth: Register User", () => {
  it("should return 201 when registering a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Sanket",
        email: "sanket@example.com",
        password: "secret123",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message");
  });
});