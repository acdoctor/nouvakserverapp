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
    res
      .status(404)
      .json({
        success: false,
        error: err instanceof Error ? err.message : String(err),
      });
  }
};

// GET ALL USERS
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ success: true, count: users.length, data: users });
  } catch {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

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
    res
      .status(400)
      .json({
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
    res
      .status(400)
      .json({
        success: false,
        error: err instanceof Error ? err.message : String(err),
      });
  }
};
