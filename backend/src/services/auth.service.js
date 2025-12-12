import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const sanitizeUser = (user) => {
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
};

export const registerUser = async (data) => {
    const { name, email, password } = data;

    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const existing = await User.findOne({ email });
    if (existing) {
        throw new ApiError(409, "User with this email already exists");
    }

    const passHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        name,
        email,
        password: passHash
    });

    return {
        user: sanitizeUser(newUser),
        token: generateToken(newUser._id)
    };
};

export const loginUser = async (data) => {
    const { email, password } = data;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    return {
        user: sanitizeUser(user),
        token: generateToken(user._id)
    };
};
