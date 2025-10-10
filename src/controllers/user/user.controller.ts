import * as userService from "../../services/user/user.service";
import { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    const user = await userService.createUser(phone);

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

export const login = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    const user = await userService.loginUser(phone);

    res.json({ message: "OTP sent for login", userId: Object(user._id) });
  } catch (err: unknown) {
    res
      .status(400)
      .json({ error: err instanceof Error ? err.message : String(err) });
  }
};
