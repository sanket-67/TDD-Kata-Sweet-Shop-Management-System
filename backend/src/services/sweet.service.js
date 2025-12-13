import Sweet from "../models/sweet.model.js";
import ApiError from "../utils/ApiError.js";

export const createSweet = async (data) => {
    const { name, category, price, quantity } = data;

    if (name === undefined || category === undefined || price === undefined || quantity === undefined) {
        throw new ApiError(400, "All fields are required");
    }

    const sweet = await Sweet.create({ name, category, price, quantity });

    return sweet;
};

export const getAllSweets = async () => {
    const sweets = await Sweet.find();
    return sweets;
};
