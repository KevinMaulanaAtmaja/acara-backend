import expess from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = expess.Router();

router.get("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/me", authMiddleware, authController.me);

export default router;
