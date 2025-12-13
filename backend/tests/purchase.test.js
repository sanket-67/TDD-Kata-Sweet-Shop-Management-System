import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import User from "../src/models/user.model.js";
import Sweet from "../src/models/sweet.model.js";

describe("Purchase Sweet API", () => {
    let token;
    let sweetId;

    beforeAll(async () => {
        // Connect to test database
        await mongoose.connect(process.env.MONGO_URI);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Clear database
        await User.deleteMany({});
        await Sweet.deleteMany({});

        // Create a user and get token via register endpoint
        const registerRes = await request(app).post("/api/auth/register").send({
            name: "Test User",
            email: "test@example.com",
            password: "password123",
            role: "customer",
        });

        token = registerRes.body.data.token;

        // Create a sweet
        const sweet = await Sweet.create({
            name: "Chocolate Bar",
            price: 2.5,
            category: "Chocolate",
            quantity: 10,
        });
        sweetId = sweet._id;
    });

    it("should decrease quantity by 1 on successful purchase", async () => {
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.quantity).toBe(9);

        // Verify in DB
        const updatedSweet = await Sweet.findById(sweetId);
        expect(updatedSweet.quantity).toBe(9);
    });

    it("should fail if quantity is 0", async () => {
        // Set quantity to 0
        await Sweet.findByIdAndUpdate(sweetId, { quantity: 0 });

        const res = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/out of stock|insufficient quantity/i);
    });

    it("should require authentication", async () => {
        const res = await request(app).post(`/api/sweets/${sweetId}/purchase`);
        expect(res.statusCode).toBe(401);
    });
});
