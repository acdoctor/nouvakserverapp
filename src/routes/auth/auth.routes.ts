import { Router } from "express";
import * as authController from "../../controllers/auth/auth.controller";

const router = Router();

router.post("/refresh", authController.refresh);

export default router;
