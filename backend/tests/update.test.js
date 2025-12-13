import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import User from "../src/models/user.model.js";
import Sweet from "../src/models/sweet.model.js";

describe("PUT /api/sweets/:id", () => {
    let token;
    let sweetId;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
        await Sweet.deleteMany({});

        // Create Admin User
        const registerRes = await request(app).post("/api/auth/register").send({
            name: "Admin User",
            email: "admin@example.com",
            password: "password123",
            role: "admin",
        });
        token = registerRes.body.data.token;

        // Create a Sweet to update
        const sweet = await Sweet.create({
            name: "Old Sweet",
            price: 10,
            quantity: 5,
            category: "Old Category"
        });
        sweetId = sweet._id.toString();
    });

    it("should update a sweet and return updated data", async () => {
        const response = await request(app)
            .put(`/api/sweets/${sweetId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Kaju Katli",
                price: 550,
                quantity: 20,
            });

        if (response.status !== 200) {
            console.log("Update Failed:", response.status, response.body);
        }
        expect(response.status).toBe(200);

        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("data");

        expect(response.body.data).toMatchObject({
            name: "Kaju Katli",
            price: 550,
            quantity: 20,
        });
    });
});
