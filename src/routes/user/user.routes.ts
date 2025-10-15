import { Router } from "express";
import * as userController from "../../controllers/user/user.controller";
import * as otpController from "../../controllers/user/otp.controller";
import * as authController from "../../controllers/user/auth.controller";
import { authenticate } from "../../middlewares/user/auth";
import { authSchema } from "../../validators/request/auth.validator";
import { validateRequest } from "../../middlewares/request/validateRequest";

const router = Router();

// User Controllers Routes
router.post(
  "/user/register",
  validateRequest(authSchema),
  userController.registerUser,
);
router.post(
  "/user/login",
  validateRequest(authSchema),
  userController.loginUser,
);
router.post("/user/resend-otp", otpController.resendOtp);
router.post("/user/verify-otp", otpController.verifyOtp);
router.post("/user/refresh", authController.refresh);
router.get("/user/profile", authenticate, (req, res) => {
  res.json({ message: "User profile accessed" });
});

export default router;
