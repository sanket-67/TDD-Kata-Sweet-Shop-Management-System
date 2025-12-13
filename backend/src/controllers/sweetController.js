import { asyncHandler } from "../middlewares/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createSweet as createSweetService, getAllSweets as getAllSweetsService, purchaseSweetService, searchSweetsService } from "../services/sweet.service.js";

export const addSweet = asyncHandler(async (req, res) => {
    const sweet = await createSweetService(req.body);

    res.status(201).json(
        new ApiResponse(201, "Sweet added successfully", sweet)
    );
});

export const getSweets = asyncHandler(async (req, res) => {
    const sweets = await getAllSweetsService();

    res.status(200).json(
        new ApiResponse(200, "Sweets fetched successfully", sweets)
    );
});

export const searchSweets = asyncHandler(async (req, res) => {
    const sweets = await searchSweetsService(req.query);

    res.status(200).json(
        new ApiResponse(200, "Sweets found successfully", sweets)
    );
});



export const purchaseSweet = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const sweet = await purchaseSweetService(id);

    res.status(200).json(
        new ApiResponse(200, "Sweet purchased successfully", sweet)
    );
});
