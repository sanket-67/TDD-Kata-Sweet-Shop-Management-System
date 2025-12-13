import { asyncHandler } from "../middlewares/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createSweet as createSweetService } from "../services/sweet.service.js";

export const addSweet = asyncHandler(async (req, res) => {
    const sweet = await createSweetService(req.body);

    res.status(201).json(
        new ApiResponse(201, "Sweet added successfully", sweet)
    );
});
