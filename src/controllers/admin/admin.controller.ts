import * as adminService from "../../services/admin/admin.service";
import { Request, Response } from "express";
import { IUser } from "../../models/user/user.model";

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { countryCode, phoneNumber } = req.body;
    const admin = await adminService.createAdmin(countryCode, phoneNumber);

    res.status(201).json({
      success: true,
      message: "OTP sent for verification",
      adminId: Object(admin._id),
    });
  } catch (err: unknown) {
    res.status(400).json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { countryCode, phoneNumber } = req.body;
    const admin = await adminService.loginAdmin(countryCode, phoneNumber);

    res.json({
      success: true,
      message: "OTP sent for login",
      adminId: Object(admin._id),
    });
  } catch (err: unknown) {
    res.status(400).json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const getAdmins = async (_req: Request, res: Response) => {
  try {
    const admins = await adminService.fetchAdmins();
    res.json({ success: true, data: admins });
  } catch (err: unknown) {
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const getAdminById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, error: "Admin ID is required" });
    }

    const admin = await adminService.fetchAdminById(id);
    return res.json({ success: true, data: admin });
  } catch (err: unknown) {
    return res.status(404).json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const updateAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, error: "Admin ID is required" });
    }

    const admin = await adminService.updateAdminById(id, req.body);
    res.json({
      success: true,
      message: "Admin updated successfully",
      data: admin,
    });
  } catch (err: unknown) {
    res.status(400).json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, error: "Admin ID is required" });
    }

    await adminService.deleteAdminById(id);
    res.json({ success: true, message: "Admin deleted successfully" });
  } catch (err: unknown) {
    res.status(400).json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const activeInactiveUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { id: userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const updatedUser: IUser | null =
      await adminService.toggleUserActiveStatus(userId);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        updatedUser.isActive === true
          ? "User account activated successfully"
          : "User account deactivated successfully",
      data: updatedUser,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    const status = message === "User not found" ? 404 : 500;

    return res.status(status).json({
      success: false,
      message,
    });
  }
};

export const userList = async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "10",
      search = "",
      sortby = "createdAt",
      orderby = "desc",
      startDate,
      endDate,
    } = req.query;

    const { users, total, pagination } = await adminService.getUserList({
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      search: search as string,
      sortField: sortby as string,
      sortOrder: (orderby as string) === "desc" ? "desc" : "asc",
      startDate: startDate as string,
      endDate: endDate as string,
    });

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "No users found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
      count: total,
      pagination,
    });
  } catch (error: unknown) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error),
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

    const addresses = await adminService.getUserAddresses(userId);

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
