import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/sweetshop"
    );
    console.log("mongodb connected");
  } catch (error) {
    console.error("db Failed:", error.message);
  }
};
