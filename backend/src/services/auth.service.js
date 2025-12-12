import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

  const cleanUser = newUser.toObject();
  delete cleanUser.password;

  const token = jwt.sign(
    { id: newUser._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    user: cleanUser,
    token
  };
};
