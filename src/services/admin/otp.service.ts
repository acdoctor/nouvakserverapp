import Otp from "../../models/otp/otp.model";
import { generateOTP } from "../../utils/generateotp";
import { sendOtpSms } from "../../utils/sendotp";
import Admin from "../../models/admin/admin.model";

export const createOtp = async (
  adminId: string,
  phone: string,
): Promise<string> => {
  // Check admin exists
  const admin = await Admin.findById(adminId);
  if (!admin) throw new Error("admin not found");
  console.log("Creating OTP for admin:", adminId, "Phone:", phone);

  // remove any existing OTPs for this admin (handles resend too)
  await Otp.deleteMany({ adminId });

  // generate new OTP
  const code = generateOTP();

  // save OTP in DB
  await Otp.create({ adminId: adminId, otp: code });

  // send via Twilio
  await sendOtpSms(phone, code);

  console.log(`OTP for adminId ${adminId}: ${code}`);
  return code;
};

export const verifyOtp = async (
  adminId: string,
  otp: string,
): Promise<boolean> => {
  // Check admin exists
  const admin = await Admin.findById(adminId);
  if (!admin) throw new Error("admin not found");

  const otpRecord = await Otp.findOne({ adminId: adminId, otp });

  if (!otpRecord) {
    throw new Error("Invalid or expired OTP");
  }

  // Temporarily disable delete OTP
  // once verified, delete OTP
  // await Otp.deleteOne({ _id: otpRecord._id });

  return true;
};
