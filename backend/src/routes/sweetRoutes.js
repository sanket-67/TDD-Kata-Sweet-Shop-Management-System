import { Router } from "express";
import { addSweet, getSweets, purchaseSweet, searchSweets } from "../controllers/sweetController.js";
import verifyToken from "../middlewares/verifyToken.js";
import checkAdmin from "../middlewares/checkAdmin.js";

const router = Router();

router.post("/", verifyToken, checkAdmin, addSweet);
router.get("/search", verifyToken, searchSweets);
router.get("/", verifyToken, getSweets);
router.post("/:id/purchase", verifyToken, purchaseSweet);

export default router;
