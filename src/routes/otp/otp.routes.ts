import { Router } from "express";
import * as otpController from "../../controllers/otp/otp.controller";

const router = Router();
router.post("/resend-otp", otpController.resendOtp);
router.post("/verify-otp", otpController.verifyOtp);

export default router;
