import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import User from "../src/models/user.model.js";
import bcrypt from "bcryptjs";

beforeAll(async () => {
    process.env.JWT_SECRET = "testsecret";
    await connectDB();
});

afterEach(async () => {
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Auth: Login User", () => {
    it("should return 200 and token when logging in with valid credentials", async () => {

        // create a test user manually
        const hashed = await bcrypt.hash("secret123", 10);
        await User.create({
            name: "Sanket",
            email: "sanket@example.com",
            password: hashed
        });

        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "sanket@example.com",
                password: "secret123"
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Login successful");
        expect(res.body.data).toHaveProperty("token");
        expect(res.body.data.user).toHaveProperty("email", "sanket@example.com");
    });
});
