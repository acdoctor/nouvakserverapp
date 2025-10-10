import User from "../../models/user/user.model";
// import * as otpService from "../user/otp.service";

export const createUser = async (phoneNumber: string) => {
  // Check if already exists
  const user = await User.findOne({ phoneNumber });
  if (user) throw new Error("User already registered");

  // Create new user with "pending" status
  const newUser = new User({ phoneNumber, status: "pending", role: "user" });
  await newUser.save();

  // Send OTP
  //   await otpService.createOtp(String(newUser._id), phoneNumber);

  return newUser;
};

export const loginUser = async (phoneNumber: string) => {
  const user = await User.findOne({ phoneNumber });
  if (!user) throw new Error("User not found");

  if (!user.phoneNumber) throw new Error("User does not have a phone number");
  //   await otpService.createOtp(String(user._id), user.phoneNumber);
  return user;
};
