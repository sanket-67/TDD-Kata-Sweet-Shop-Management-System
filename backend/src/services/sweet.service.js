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
    return await Sweet.find({});
};

export const purchaseSweetService = async (sweetId) => {
    const sweet = await Sweet.findById(sweetId);

    if (!sweet) {
        throw new ApiError(404, "Sweet not found");
    }

    if (sweet.quantity <= 0) {
        throw new ApiError(400, "Sweet is out of stock");
    }

    sweet.quantity -= 1;
    await sweet.save();

    return sweet;
};
