import expess from "express";
import authController from "../controllers/auth.controller";

const router = expess.Router();

router.get("/auth/register", authController.register);
router.post("/auth/login", authController.login);

export default router;
