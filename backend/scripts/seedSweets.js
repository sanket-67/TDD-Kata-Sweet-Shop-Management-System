import mongoose from "mongoose";
import dotenv from "dotenv";
import Sweet from "../src/models/sweet.model.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const sweets = [
    { name: "Gulab Jamun", category: "Syrup Based", price: 30, quantity: 50 },
    { name: "Rasgulla", category: "Bengal Special", price: 25, quantity: 50 },
    { name: "Kaju Katli", category: "Dry Fruit", price: 15, quantity: 100 },
    { name: "Motichoor Laddu", category: "Laddu", price: 20, quantity: 80 },
    { name: "Jalebi", category: "Fried", price: 20, quantity: 60 },
    { name: "Mysore Pak", category: "Ghee Based", price: 25, quantity: 40 },
    { name: "Rasmalai", category: "Milk Based", price: 40, quantity: 30 },
    { name: "Kalakand", category: "Milk Based", price: 30, quantity: 40 },
    { name: "Besan Laddu", category: "Laddu", price: 15, quantity: 70 },
    { name: "Soan Papdi", category: "Flaky", price: 20, quantity: 50 },
    { name: "Gajar Ka Halwa", category: "Halwa", price: 50, quantity: 30 },
    { name: "Peda", category: "Milk Based", price: 10, quantity: 100 },
    { name: "Barfi", category: "Milk Based", price: 15, quantity: 90 },
    { name: "Sandesh", category: "Bengal Special", price: 30, quantity: 40 },
    { name: "Imarti", category: "Fried", price: 25, quantity: 50 }
];

const seedDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is undefined. Check .env file path.");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        // Clear existing data to avoid duplicates
        await Sweet.deleteMany({});
        console.log("Cleared existing sweets...");

        // Insert new data
        await Sweet.insertMany(sweets);
        console.log(`Successfully added ${sweets.length} Indian sweets!`);

        process.exit();
    } catch (err) {
        console.error("Error seeding database:", err);
        process.exit(1);
    }
};

seedDB();
