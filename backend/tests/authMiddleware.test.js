import request from "supertest";
import app from "../src/app.js";
import jwt from "jsonwebtoken";

beforeAll(() => {
    process.env.JWT_SECRET = "testsecret";
});

describe("Middleware: verifyToken", () => {

    it("should return 401 if no token is provided", async () => {
        const res = await request(app).get("/api/protected/test");

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("message", "No token provided");
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .get("/api/protected/test")
            .set("Authorization", "Bearer invalidtoken");

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("message", "Invalid or expired token");
    });

    it("should allow request if token is valid", async () => {
        const token = jwt.sign({ id: "123" }, process.env.JWT_SECRET, { expiresIn: "1h" });

        const res = await request(app)
            .get("/api/protected/test")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Protected route accessed");
    });
});

describe("Middleware: checkAdmin", () => {
    it("should return 403 if user is not admin", async () => {
        const token = jwt.sign({ id: "123", role: "user" }, process.env.JWT_SECRET);
        const res = await request(app)
            .get("/api/protected/admin")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty("message", "Access denied. Admin only.");
    });

    it("should allow request if user is admin", async () => {
        const token = jwt.sign({ id: "123", role: "admin" }, process.env.JWT_SECRET);
        const res = await request(app)
            .get("/api/protected/admin")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Admin route accessed");
    });
});
