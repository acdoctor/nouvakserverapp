import User from "../../models/user/user.model";
import * as otpService from "../user/otp.service";
import { IUser } from "../../models/user/user.model";
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

export const createUser = async (countryCode: string, phoneNumber: string) => {
  phoneNumber = phoneNumber.trim();

  // Check if already exists
  const user = await User.findOne({ countryCode, phoneNumber });
  if (user) throw new Error("User already registered");

  const newUser = new User({
    countryCode,
    phoneNumber,
    status: "pending",
    role: "user",
  });
  await newUser.save();

  // Create new user with "pending" status
  const fullPhone = countryCode.startsWith("+")
    ? `${countryCode}${phoneNumber}`
    : `+${countryCode}${phoneNumber}`;

  // Send OTP
  await otpService.createOtp(String(newUser._id), fullPhone);

  return newUser;
};

export const loginUser = async (countryCode: string, phoneNumber: string) => {
  phoneNumber = phoneNumber.trim();

  const user = await User.findOne({ countryCode, phoneNumber });
  if (!user) throw new Error("user not found");

  const fullPhone = user.countryCode?.startsWith("+")
    ? `${user.countryCode}${user.phoneNumber}`
    : `+${user.countryCode}${user.phoneNumber}`;

  await otpService.createOtp(String(user._id), fullPhone);

  return user;
};

// GET USER BY ID
export const getUserById = async (id: string) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");
  return user;
};

// UPDATE USER
export const updateUser = async (id: string, updateData: Partial<IUser>) => {
  const user = await User.findByIdAndUpdate(id, updateData, { new: true });
  if (!user) throw new Error("User not found or update failed");
  return user;
};

// DELETE USER
export const deleteUser = async (id: string) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error("User not found or already deleted");
  return user;
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
