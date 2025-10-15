import { Router } from "express";
import * as otpController from "../../controllers/technician/otp.controller";
import * as authController from "../../controllers/technician/auth.controller";
import * as technicianController from "../../controllers/technician/technician.controller";
import { authenticate } from "../../middlewares/technician/auth";

const router = Router();

// Technician Controllers Routes
router.post("/technician/register", technicianController.registerTechnician);
router.post("/technician/login", technicianController.loginTechnician);
router.post("/technician/resend-otp", otpController.resendOtp);
router.post("/technician/verify-otp", otpController.verifyOtp);
router.post("/technician/refresh", authController.refresh);
router.get("/technician/profile", authenticate, (req, res) => {
  res.json({ message: "Technician profile accessed" });
});

export default router;
