import { Router } from "express";
import * as userController from "../../controllers/user/user.controller";
import * as otpController from "../../controllers/user/otp.controller";
import * as authController from "../../controllers/user/auth.controller";
import { authenticate } from "../../middlewares/user/auth";

const router = Router();

// User Controllers Routes
router.post("/user/register", userController.registerUser);
router.post("/user/login", userController.loginUser);
router.post("/user/resend-otp", otpController.resendOtp);
router.post("/user/verify-otp", otpController.verifyOtp);
router.post("/user/refresh", authController.refresh);
router.get("/user/profile", authenticate, (req, res) => {
  res.json({ message: "User profile accessed" });
});

export default router;
