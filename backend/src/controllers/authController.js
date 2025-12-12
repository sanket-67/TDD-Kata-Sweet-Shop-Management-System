import { asyncHandler } from "../middlewares/asyncHandler.js";
import { registerUser, loginUser } from "../services/auth.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const register = asyncHandler(async (req, res) => {
    const result = await registerUser(req.body);

    res.status(201).json(
        new ApiResponse(201, "User registered successfully", result)
    );
});

export const login = asyncHandler(async (req, res) => {
    const result = await loginUser(req.body);

    res.status(200).json(
        new ApiResponse(200, "Login successful", result)
    );
});
