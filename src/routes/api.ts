import expess from "express";
import dummyController from "../controllers/dummy.controller";

const router = expess.Router();

router.get("/dummy", dummyController.dummy);

export default router;
