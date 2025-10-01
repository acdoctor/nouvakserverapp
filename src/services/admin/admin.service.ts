import Admin from "../../models/admin/admin.model";
import * as otpService from "../otp.service";

export const registerAdmin = async (phone: string) => {
  // Check if already exists
  const admin = await Admin.findOne({ phone });
  if (admin) throw new Error("User already registered");

  // Create new user with "pending" status
  const newAdmin = new Admin({ phone, status: "pending", role: "admin" });
  await newAdmin.save();

  // Send OTP
  //   const adminId = findOne({ phone });
  await otpService.createOtp(String(newAdmin._id), phone);

  return newAdmin;
};

export const loginAdmin = async (phone: string) => {
  const admin = await Admin.findOne({ phone });
  if (!admin) throw new Error("Admin not found");

  if (!admin.phone) throw new Error("Admin does not have a phone number");
  await otpService.createOtp(String(admin._id), admin.phone);
  return admin;
};
