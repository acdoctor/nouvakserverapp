import * as userService from "../../services/user/user.service";
import { Request, Response } from "express";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { countryCode, phoneNumber } = req.body;
    const user = await userService.createUser(countryCode, phoneNumber);

    res.status(201).json({
      success: true,
      message: "OTP sent for verification",
      userId: Object(user._id),
    });
  } catch (err: unknown) {
    res.status(400).json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { countryCode, phoneNumber } = req.body;
    const user = await userService.loginUser(countryCode, phoneNumber);

    res.json({
      success: true,
      message: "OTP sent for login",
      userId: Object(user._id),
    });
  } catch (err: unknown) {
    res.status(400).json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

// GET USER BY ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, error: "User ID is required" });
    }

    const user = await userService.getUserById(id);
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(404).json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

// GET ALL USERS
// export const getAllUsers = async (_req: Request, res: Response) => {
//   try {
//     const users = await userService.getAllUsers();
//     res.json({ success: true, count: users.length, data: users });
//   } catch {
//     res.status(500).json({ success: false, error: "Something went wrong" });
//   }
// };

// UPDATE USER
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, error: "User ID is required" });
    }

    const user = await userService.updateUser(id, req.body);
    res.json({ success: true, message: "User updated", data: user });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

// DELETE USER
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, error: "User ID is required" });
    }

    await userService.deleteUser(id);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const userAddressesList = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const addresses = await userService.getUserAddresses(userId);

    if (!addresses.length) {
      return res.status(404).json({
        success: false,
        message: "No addresses found for this user",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Addresses fetched successfully",
      data: addresses,
      count: addresses.length,
    });
  } catch (error: unknown) {
    console.error("Error fetching user addresses:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
