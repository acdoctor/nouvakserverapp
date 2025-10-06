import { Router } from "express";
import * as adminController from "../../controllers/admin/admin.controller";
import { authenticate } from "../../middlewares/auth";

const router = Router();

router.post("/admin/register", adminController.register);
router.post("/admin/login", adminController.login);
router.post("/admin/profile", authenticate, (req, res) => {
  res.json({ message: "Admin profile accessed" });
});

export default router;
