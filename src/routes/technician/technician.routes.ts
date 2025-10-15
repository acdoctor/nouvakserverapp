import { Router } from "express";
import * as otpController from "../../controllers/technician/otp.controller";
import * as authController from "../../controllers/technician/auth.controller";
import * as technicianController from "../../controllers/technician/technician.controller";
import { authenticate } from "../../middlewares/technician/auth";
import { authSchema } from "../../validators/request/auth.validator";
import { validateRequest } from "../../middlewares/request/validateRequest";

const router = Router();

// Technician Controllers Routes
router.post(
  "/technician/register",
  validateRequest(authSchema),
  technicianController.registerTechnician,
);
router.post(
  "/technician/login",
  validateRequest(authSchema),
  technicianController.loginTechnician,
);
router.post("/technician/resend-otp", otpController.resendOtp);
router.post("/technician/verify-otp", otpController.verifyOtp);
router.post("/technician/refresh", authController.refresh);
router.get("/technician/profile", authenticate, (req, res) => {
  res.json({ message: "Technician profile accessed" });
});

export default router;
