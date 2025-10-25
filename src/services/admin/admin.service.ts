import Admin from "../../models/admin/admin.model";
import * as otpService from "../admin/otp.service";
import { IAdmin } from "../../models/admin/admin.model";
import User from "../../models/user/user.model";
import mongoose, { Types } from "mongoose";
import Address from "../../models/user/address.model";

interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
}

export const createAdmin = async (countryCode: string, phoneNumber: string) => {
  phoneNumber = phoneNumber.trim();

  // Check if admin already exists
  const admin = await Admin.findOne({ countryCode, phoneNumber });
  if (admin) throw new Error("Admin already registered");

  const newAdmin = new Admin({
    countryCode,
    phoneNumber,
    status: "pending",
    role: "admin",
  });
  await newAdmin.save();

  // Create new admin with "pending" status
  const fullPhone = countryCode.startsWith("+")
    ? `${countryCode}${phoneNumber}`
    : `+${countryCode}${phoneNumber}`;

  // Send OTP
  await otpService.createOtp(String(newAdmin._id), fullPhone);

  return newAdmin;
};

export const loginAdmin = async (countryCode: string, phoneNumber: string) => {
  phoneNumber = phoneNumber.trim();

  const admin = await Admin.findOne({ countryCode, phoneNumber });
  if (!admin) throw new Error("Admin not found");

  const fullPhone = admin.countryCode?.startsWith("+")
    ? `${admin.countryCode}${admin.phoneNumber}`
    : `+${admin.countryCode}${admin.phoneNumber}`;

  await otpService.createOtp(String(admin._id), fullPhone);

  return admin;
};

export const fetchAdmins = async () => {
  return await Admin.find();
};

export const fetchAdminById = async (id: string) => {
  const admin = await Admin.findById(id);
  if (!admin) throw new Error("Admin not found");
  return admin;
};

export const updateAdminById = async (
  id: string,
  updateData: Partial<IAdmin>,
) => {
  const admin = await Admin.findByIdAndUpdate(id, updateData, { new: true });
  if (!admin) throw new Error("Admin not found");
  return admin;
};

export const deleteAdminById = async (id: string) => {
  const admin = await Admin.findByIdAndDelete(id);
  if (!admin) throw new Error("Admin not found");
  return admin;
};

export const toggleUserActiveStatus = async (userId: string) => {
  if (!userId) throw new Error("User ID is required");

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const updatedUser = await User.findOneAndUpdate(
    { _id: new Types.ObjectId(userId) },
    { isActive: user.isActive === true ? false : true },
    { new: true },
  );

  return updatedUser;
};

export const getUserList = async ({
  page = 1,
  limit = 10,
  search = "",
  sortField = "createdAt",
  sortOrder = "desc",
  startDate,
  endDate,
}: UserListParams) => {
  const skip = (page - 1) * limit;
  const sort = { [sortField]: sortOrder === "desc" ? -1 : 1 };

  const matchConditions: Record<string, unknown> = {};

  // Search filter
  if (search) {
    matchConditions.$or = [
      { phoneNumber: { $regex: search, $options: "i" } },
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  // Date filters
  if (startDate && endDate) {
    matchConditions.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  } else if (startDate) {
    matchConditions.createdAt = { $gte: new Date(startDate) };
  } else if (endDate) {
    matchConditions.createdAt = { $lte: new Date(endDate) };
  }

  // Query aggregation
  const users = await User.aggregate([
    { $match: matchConditions },
    {
      $project: {
        name: { $ifNull: ["$name", ""] },
        phoneNumber: { $ifNull: ["$phoneNumber", ""] },
        countryCode: { $ifNull: ["$countryCode", ""] },
        isActive: { $ifNull: ["$isActive", false] },
        isOtpVerify: { $ifNull: ["$isOtpVerify", false] },
        createdAt: { $ifNull: ["$createdAt", ""] },
        type: { $ifNull: ["$type", "NA"] },
        email: { $ifNull: ["$email", ""] },
      },
    },
    { $sort: sort as Record<string, 1 | -1> },
    { $skip: skip },
    { $limit: limit },
  ]);

  const total = await User.countDocuments(matchConditions);

  return {
    users,
    total,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getUserAddresses = async (userId: string) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid or missing userId");
  }

  const addresses = await Address.find({ userId }).lean();

  if (!addresses || addresses.length === 0) {
    throw new Error("No addresses found for this user");
  }

  return addresses;
};
