import { Router } from "express";
import * as otpController from "../../controllers/otp/otp.controller";

const router = Router();
router.post("/otp/resend-otp", otpController.resendOtp);
router.post("/otp/verify-otp", otpController.verifyOtp);

export default router;
