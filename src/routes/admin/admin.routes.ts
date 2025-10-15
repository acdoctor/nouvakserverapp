import { Router } from "express";
import * as adminController from "../../controllers/admin/admin.controller";
import * as otpController from "../../controllers/admin/otp.controller";
import * as authController from "../../controllers/admin/auth.controller";
import * as technicianController from "../../controllers/technician/technician.controller";
import * as userController from "../../controllers/user/user.controller";
import { authenticate } from "../../middlewares/admin/auth";

const router = Router();

// Admin Controllers Routes
router.post("/admin/register", adminController.registerAdmin);
router.post("/admin/login", adminController.loginAdmin);
router.post("/admin/resend-otp", otpController.resendOtp);
router.post("/admin/verify-otp", otpController.verifyOtp);
router.post("/admin/refresh", authController.refresh);
router.get("/admin/profile", authenticate, (req, res) => {
  res.json({ message: "Admin profile accessed" });
});

// Technician Controllers Routes
router.post(
  "/admin/technician/register",
  technicianController.registerTechnician,
);

// User Controllers Routes
router.post("/admin/user/register", userController.registerUser);
export default router;
