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

export const searchSweetsService = async (query) => {
    const { name, category, minPrice, maxPrice } = query;
    let filter = {};

    if (name) {
        filter.name = { $regex: name, $options: "i" };
    }

    if (category) {
        filter.category = { $regex: category, $options: "i" };
    }

    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    return await Sweet.find(filter);
};



export const updateSweetService = async (id, updateData) => {
    const sweet = await Sweet.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });

    if (!sweet) {
        throw new ApiError(404, "Sweet not found");
    }

    return sweet;
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

export const deleteSweetService = async (id) => {
    const sweet = await Sweet.findByIdAndDelete(id);

    if (!sweet) {
        throw new ApiError(404, "Sweet not found");
    }

    return sweet;
};

export const restockSweetService = async (id, quantity) => {
    if (!quantity || quantity <= 0) {
        throw new ApiError(400, "Invalid quantity");
    }

    const sweet = await Sweet.findById(id);

    if (!sweet) {
        throw new ApiError(404, "Sweet not found");
    }

    sweet.quantity += quantity;
    await sweet.save();

    return sweet;
};
