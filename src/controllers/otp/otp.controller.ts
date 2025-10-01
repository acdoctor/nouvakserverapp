import * as otpService from "../../services/otp.service";
import Admin from "../../models/admin/admin.model";
import { Request, Response } from "express";

export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const user = await Admin.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await otpService.createOtp(String(user._id), user.phone ?? "");
    res.json({ message: "OTP resent successfully" });
  } catch (err: unknown) {
    res
      .status(400)
      .json({ error: err instanceof Error ? err.message : String(err) });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { userId, otp } = req.body;
    await otpService.verifyOtp(userId, otp);

    res.json({ message: "OTP verified, user activated" });
  } catch (err: unknown) {
    res
      .status(400)
      .json({ error: err instanceof Error ? err.message : String(err) });
  }
};
