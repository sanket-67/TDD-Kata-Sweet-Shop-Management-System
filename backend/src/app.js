import express from "express";
import cors from "cors";
import morgan from "morgan";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import authRoute from './routes/authRoutes.js'
import verifyToken from "./middlewares/verifyToken.js";
import checkAdmin from "./middlewares/checkAdmin.js";
import sweetRoutes from "./routes/sweetRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
// Temporary route for middleware testing
app.get("/api/protected/test", verifyToken, (req, res) => {
    res.status(200).json({ message: "Protected route accessed" });
});

app.get("/api/protected/admin", verifyToken, checkAdmin, (req, res) => {
    res.status(200).json({ message: "Admin route accessed" });
});

app.use("/api/auth", authRoute);

app.use("/api/sweets", sweetRoutes);
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Api Is Running ",
    });
});

app.use(errorMiddleware);
export default app;
