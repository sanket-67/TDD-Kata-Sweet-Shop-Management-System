import { asyncHandler } from "../middlewares/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createSweet as createSweetService, getAllSweets as getAllSweetsService, purchaseSweetService, searchSweetsService, updateSweetService, deleteSweetService, restockSweetService } from "../services/sweet.service.js";

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



export const updateSweet = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedSweet = await updateSweetService(id, req.body);

    res.status(200).json(
        new ApiResponse(200, "Sweet updated successfully", updatedSweet)
    );
});

export const purchaseSweet = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const sweet = await purchaseSweetService(id);

    res.status(200).json(
        new ApiResponse(200, "Sweet purchased successfully", sweet)
    );
});

export const deleteSweet = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await deleteSweetService(id);

    res.status(200).json(
        new ApiResponse(200, "Sweet deleted successfully", null)
    );
});

export const restockSweet = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const sweet = await restockSweetService(id, quantity);

    res.status(200).json(
        new ApiResponse(200, "Sweet restocked successfully", sweet)
    );
});
