import Otp from "../../models/otp/otp.model";
import { generateOTP } from "../../utils/generateotp";
import { sendOtpSms } from "../../utils/sendotp";
import Admin from "../../models/admin/admin.model";

export const createOtp = async (
  userId: string,
  phone: string,
): Promise<string> => {
  // Check user exists
  const user = await Admin.findById(userId);
  if (!user) throw new Error("User not found");
  console.log("Creating OTP for user:", userId, "Phone:", phone);

  // remove any existing OTPs for this user (handles resend too)
  await Otp.deleteMany({ userId });

  // generate new OTP
  const code = generateOTP();

  // save OTP in DB
  await Otp.create({ adminId: userId, otp: code });

  // send via Twilio
  await sendOtpSms(phone, code);

  console.log(`OTP for userId ${userId}: ${code}`);
  return code;
};

export const verifyOtp = async (
  userId: string,
  otp: string,
): Promise<boolean> => {
  // Check user exists
  const admin = await Admin.findById(userId);
  if (!admin) throw new Error("User not found");

  const otpRecord = await Otp.findOne({ adminId: userId, otp });

  if (!otpRecord) {
    throw new Error("Invalid or expired OTP");
  }

  // once verified, delete OTP
  await Otp.deleteOne({ _id: otpRecord._id });

  return true;
};
