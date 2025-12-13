import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import jwt from "jsonwebtoken";

beforeAll(async () => {
    process.env.JWT_SECRET = "testsecret";
    await connectDB();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Sweets: Add Sweet", () => {
    it("should return 201 when admin adds a new sweet", async () => {
        const adminToken = jwt.sign(
            { id: "admin123", role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const res = await request(app)
            .post("/api/sweets")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Chocolate Fudge",
                category: "Fudge",
                price: 5.99,
                quantity: 50
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("message", "Sweet added successfully");
        expect(res.body.data).toHaveProperty("name", "Chocolate Fudge");
    });
});
