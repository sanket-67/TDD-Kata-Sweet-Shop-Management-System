import { Router } from "express";
import { addSweet, getSweets, purchaseSweet, searchSweets, updateSweet } from "../controllers/sweetController.js";
import verifyToken from "../middlewares/verifyToken.js";
import checkAdmin from "../middlewares/checkAdmin.js";

const router = Router();

router.post("/", verifyToken, checkAdmin, addSweet);
router.put("/:id", verifyToken, checkAdmin, updateSweet);
router.get("/search", verifyToken, searchSweets);
router.get("/", verifyToken, getSweets);
router.post("/:id/purchase", verifyToken, purchaseSweet);

export default router;
