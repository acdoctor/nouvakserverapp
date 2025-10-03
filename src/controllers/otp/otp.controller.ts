import * as otpService from "../../services/otp/otp.service";
import Admin from "../../models/admin/admin.model";
import { Request, Response } from "express";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";

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

    const admin = await Admin.findById(userId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    //  Generate tokens
    const accessToken = generateAccessToken({
      id: admin._id,
      role: admin.role,
    });
    const refreshToken = generateRefreshToken({
      id: admin._id,
      role: admin.role,
    });

    //  Save refreshToken in DB
    admin.refreshToken = refreshToken;
    admin.status = "active";
    await admin.save();

    res.json({
      message: "OTP verified, admin activated",
      accessToken,
      refreshToken,
    });
  } catch (err: unknown) {
    res
      .status(400)
      .json({ error: err instanceof Error ? err.message : String(err) });
  }
};
