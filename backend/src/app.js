import express from "express";
import cors from "cors";
import morgan from "morgan";
import errorMiddleware from "./middlewares/errorMiddleware.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(errorMiddleware);
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Api Is Running ",
  });
});

export default app;
