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
import { updateUserSchema } from "../../validators/user/user.validator";

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

router.post(
  "/admin/user/toggle-active/:id",
  authenticate,
  adminController.activeInactiveUser,
);

// Technician Controllers Routes
router.post(
  "/admin/technician/register",
  technicianController.registerTechnician,
);

// User Controllers Routes
router.post("/admin/user/register", userController.registerUser);
router.get("/admin/user/profile/:id", authenticate, userController.getUserById);
router.get("/admin/user/all", userController.getAllUsers);
router.put(
  "/admin/user/update/:id",
  validateRequest(updateUserSchema),
  userController.updateUser,
);
router.delete("/admin/user/delete/:id", userController.deleteUser);
export default router;
