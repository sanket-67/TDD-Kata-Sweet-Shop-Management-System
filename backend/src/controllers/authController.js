import { asyncHandler } from "../middlewares/asyncHandler.js";
import { registerUser } from "../services/auth.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);

  res.status(201).json(
    new ApiResponse(201, "User registered successfully", result)
  );
});
