import { Router } from "express";
import * as adminController from "../../controllers/admin/admin.controller";

const router = Router();

router.post("/register", adminController.register);
router.post("/login", adminController.login);

export default router;
