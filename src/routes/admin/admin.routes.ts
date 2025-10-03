import { Router } from "express";
import * as adminController from "../../controllers/admin/admin.controller";

const router = Router();

router.post("/admin/register", adminController.register);
router.post("/admin/login", adminController.login);

export default router;
