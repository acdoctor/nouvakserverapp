import { Router } from "express";
import * as adminController from "../../controllers/admin/admin.controller";
import * as otpController from "../../controllers/admin/otp.controller";
import { authenticate } from "../../middlewares/auth";

const router = Router();

router.post("/admin/register", adminController.register);
router.post("/admin/login", adminController.login);
router.post("/admin/resend-otp", otpController.resendOtp);
router.post("/admin/verify-otp", otpController.verifyOtp);
router.post("/admin/profile", authenticate, (req, res) => {
  res.json({ message: "Admin profile accessed" });
});

export default router;
