import { Router } from "express";
import * as adminController from "../../controllers/admin/admin.controller";
import * as otpController from "../../controllers/admin/otp.controller";
import * as authController from "../../controllers/admin/auth.controller";
import * as technicianController from "../../controllers/technician/technician.controller";
import * as userController from "../../controllers/user/user.controller";
import { authenticate } from "../../middlewares/admin/auth";
import { authSchema } from "../../validators/request/auth.validator";
import { validateRequest } from "../../middlewares/request/validateRequest";
import { adminUpdateSchema } from "../../validators/admin/admin.validator";

const router = Router();

// Admin Controllers Routes
router.post(
  "/admin/register",
  validateRequest(authSchema),
  adminController.registerAdmin,
);
router.post(
  "/admin/login",
  validateRequest(authSchema),
  adminController.loginAdmin,
);
router.post("/admin/resend-otp", otpController.resendOtp);
router.post("/admin/verify-otp", otpController.verifyOtp);
router.post("/admin/refresh", authController.refresh);
router.get("/admin/profile/:id", authenticate, adminController.getAdminById);
router.get("/admin/all/", authenticate, adminController.getAdmins);
router.delete("/admin/delete/:id", authenticate, adminController.deleteAdmin);
router.put(
  "/admin/update/:id",
  authenticate,
  validateRequest(adminUpdateSchema),
  adminController.updateAdmin,
);

// Technician Controllers Routes
router.post(
  "/admin/technician/register",
  technicianController.registerTechnician,
);

// User Controllers Routes
router.post("/admin/user/register", userController.registerUser);
export default router;
