import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "./asyncHandler.js";

const verifyToken = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(401, "No token provided");
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid or expired token");
    }
});

export default verifyToken;
