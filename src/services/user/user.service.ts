import User from "../../models/user/user.model";
import * as otpService from "../user/otp.service";

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
