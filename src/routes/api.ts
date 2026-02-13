import expess from "express";
import authController from "../controllers/auth.controller";

const router = expess.Router();

router.get("/auth/register", authController.register);

export default router;
