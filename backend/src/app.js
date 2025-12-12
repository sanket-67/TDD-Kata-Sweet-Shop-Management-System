import express from "express";
import cors from "cors";
import morgan from "morgan";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import authRoute from './routes/authRoutes.js'
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth",authRoute);
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Api Is Running ",
    });
});

app.use(errorMiddleware);
export default app;
