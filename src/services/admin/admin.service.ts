import Admin from "../../models/admin/admin.model";
import * as otpService from "../admin/otp.service";

export const createAdmin = async (phoneNumber: string) => {
  // Check if already exists
  const admin = await Admin.findOne({ phoneNumber });
  if (admin) throw new Error("Admin already registered");

  // Create new admin with "pending" status
  const newAdmin = new Admin({ phoneNumber, status: "pending", role: "admin" });
  await newAdmin.save();

  // Send OTP
  await otpService.createOtp(String(newAdmin._id), phoneNumber);

  return newAdmin;
};

export const loginAdmin = async (phoneNumber: string) => {
  const admin = await Admin.findOne({ phoneNumber });
  if (!admin) throw new Error("Admin not found");

  if (!admin.phoneNumber) throw new Error("Admin does not have a phone number");
  await otpService.createOtp(String(admin._id), admin.phoneNumber);
  return admin;
};
