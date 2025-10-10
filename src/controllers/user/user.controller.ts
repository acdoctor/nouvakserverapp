import * as userService from "../../services/user/user.service";
import { Request, Response } from "express";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;
    const user = await userService.createUser(phoneNumber);

    res.status(201).json({
      message: "OTP sent for verification",
      userId: Object(user._id),
    });
  } catch (err: unknown) {
    res
      .status(400)
      .json({ error: err instanceof Error ? err.message : String(err) });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;
    const user = await userService.loginUser(phoneNumber);

    res.json({ message: "OTP sent for login", userId: Object(user._id) });
  } catch (err: unknown) {
    res
      .status(400)
      .json({ error: err instanceof Error ? err.message : String(err) });
  }
};
