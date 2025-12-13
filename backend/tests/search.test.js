import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import User from "../src/models/user.model.js";
import Sweet from "../src/models/sweet.model.js";

describe("Search Sweet API", () => {
    let token;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
        await Sweet.deleteMany({});

        // Create a user and get token
        const registerRes = await request(app).post("/api/auth/register").send({
            name: "Test User",
            email: "test@example.com",
            password: "password123",
            role: "customer",
        });
        token = registerRes.body.data.token;

        // Seed sweets for searching
        await Sweet.create([
            { name: "Chocolate Bar", price: 2.5, category: "Chocolate", quantity: 10 },
            { name: "Gummy Bears", price: 1.5, category: "Gummy", quantity: 20 },
            { name: "Lollipop", price: 0.5, category: "Hard Candy", quantity: 50 },
            { name: "Dark Chocolate", price: 3.0, category: "Chocolate", quantity: 5 },
        ]);
    });

    it("should search sweets by name", async () => {
        const res = await request(app)
            .get("/api/sweets/search?name=Chocolate")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(2); // Chocolate Bar and Dark Chocolate
        expect(res.body.data[0].name).toMatch(/Chocolate/);
    });

    it("should search sweets by category", async () => {
        const res = await request(app)
            .get("/api/sweets/search?category=Gummy")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].name).toBe("Gummy Bears");
    });

    it("should search sweets by price range", async () => {
        const res = await request(app)
            .get("/api/sweets/search?minPrice=1.0&maxPrice=3.0")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(3); // Chocolate Bar (2.5), Gummy Bears (1.5), Dark Chocolate (3.0)
        // Lollipop (0.5) should be excluded
    });
});
