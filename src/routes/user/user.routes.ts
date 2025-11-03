import { Router } from "express";
import * as userController from "../../controllers/user/user.controller";
import * as otpController from "../../controllers/user/otp.controller";
import * as authController from "../../controllers/user/auth.controller";
import { authenticate } from "../../middlewares/user/auth";
import { authSchema } from "../../validators/request/auth.validator";
import { validateRequest } from "../../middlewares/request/validateRequest";
import { updateUserSchema } from "../../validators/user/user.validator";

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
  userController.loginRegisterUser,
);
router.post("/user/resend-otp", otpController.resendOtp);
router.post("/user/verify-otp", otpController.verifyOtp);
router.post("/user/refresh", authController.refresh);
router.get("/user/profile/:id", authenticate, userController.getUserById);
router.put(
  "/user/update/:id",
  validateRequest(updateUserSchema),
  userController.updateUser,
);
router.delete("/user/delete/:id", userController.deleteUser);
router.get("/user/addresses-list/:userId", userController.userAddressesList);

export default router;
