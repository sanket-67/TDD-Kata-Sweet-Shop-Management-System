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

describe("Sweets: Get All Sweets", () => {
    it("should return 200 and list of sweets for authenticated user", async () => {
        const token = jwt.sign({ id: "user123", role: "user" }, process.env.JWT_SECRET);

        const res = await request(app)
            .get("/api/sweets")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Sweets fetched successfully");
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});

describe("Sweets: Delete Sweet", () => {
    it("should return 200 when admin deletes a sweet", async () => {
        const adminToken = jwt.sign(
            { id: "admin123", role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // First add a sweet
        const addRes = await request(app)
            .post("/api/sweets")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Test Sweet",
                category: "Test",
                price: 3.99,
                quantity: 20
            });

        const sweetId = addRes.body.data._id;

        // Delete the sweet
        const res = await request(app)
            .delete(`/api/sweets/${sweetId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Sweet deleted successfully");
    });

    it("should return 404 when trying to delete non-existent sweet", async () => {
        const adminToken = jwt.sign(
            { id: "admin123", role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const res = await request(app)
            .delete("/api/sweets/507f1f77bcf86cd799439011")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("message", "Sweet not found");
    });

    it("should return 403 when non-admin tries to delete a sweet", async () => {
        const userToken = jwt.sign(
            { id: "user123", role: "user" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const res = await request(app)
            .delete("/api/sweets/507f1f77bcf86cd799439011")
            .set("Authorization", `Bearer ${userToken}`);

        expect(res.status).toBe(403);
    });
});

describe("Sweets: Restock Sweet", () => {
    it("should return 200 when admin restocks a sweet", async () => {
        const adminToken = jwt.sign(
            { id: "admin123", role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // First add a sweet
        const addRes = await request(app)
            .post("/api/sweets")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Restock Test Sweet",
                category: "Test",
                price: 4.99,
                quantity: 10
            });

        const sweetId = addRes.body.data._id;

        // Restock the sweet
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/restock`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ quantity: 30 });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Sweet restocked successfully");
        expect(res.body.data).toHaveProperty("quantity", 40);
    });

    it("should return 404 when trying to restock non-existent sweet", async () => {
        const adminToken = jwt.sign(
            { id: "admin123", role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const res = await request(app)
            .post("/api/sweets/507f1f77bcf86cd799439011/restock")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ quantity: 30 });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("message", "Sweet not found");
    });

    it("should return 400 when restock quantity is invalid", async () => {
        const adminToken = jwt.sign(
            { id: "admin123", role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // First add a sweet
        const addRes = await request(app)
            .post("/api/sweets")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Invalid Restock Test",
                category: "Test",
                price: 2.99,
                quantity: 10
            });

        const sweetId = addRes.body.data._id;

        // Try to restock with invalid quantity
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/restock`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ quantity: -5 });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message", "Invalid quantity");
    });

    it("should return 403 when non-admin tries to restock a sweet", async () => {
        const userToken = jwt.sign(
            { id: "user123", role: "user" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const res = await request(app)
            .post("/api/sweets/507f1f77bcf86cd799439011/restock")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ quantity: 30 });

        expect(res.status).toBe(403);
    });
});
