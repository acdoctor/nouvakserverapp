import { HTTP_CODE, MESSAGE, STATUS } from "../../constants/responseConstants";
import * as adminService from "../../services/admin/admin.service";
import { Request, Response } from "express";

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { countryCode, phoneNumber } = req.body;
    if (!countryCode || !phoneNumber) {
      return res.status(HTTP_CODE.BAD_REQUEST).json({
        success: STATUS.FAIL,
        message: MESSAGE.FIELDS_REQUIRED,
      });
    }

    const admin = await adminService.createAdmin(countryCode, phoneNumber);

    return res.status(HTTP_CODE.CREATED).json({
      success: STATUS.SUCCESS,
      message: MESSAGE.OTP_SENT,
      adminId: Object(admin._id),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const statusCode = message.includes("Admin already registered")
      ? HTTP_CODE.CONFLICT
      : HTTP_CODE.SERVER_ERROR;

    return res.status(statusCode).json({
      success: STATUS.FAIL,
      error: statusCode === HTTP_CODE.CONFLICT ? message : MESSAGE.SERVER_ERROR,
    });
  }
};

export const loginRegisterAdmin = async (req: Request, res: Response) => {
  try {
    const { countryCode, phoneNumber } = req.body;

    if (!countryCode || !phoneNumber) {
      return res.status(HTTP_CODE.BAD_REQUEST).json({
        success: STATUS.FAIL,
        message: MESSAGE.FIELDS_REQUIRED,
      });
    }

    const admin = await adminService.loginAdmin(countryCode, phoneNumber);

    if (!admin) {
      const newAdmin = await adminService.createAdmin(countryCode, phoneNumber);

      return res.status(HTTP_CODE.CREATED).json({
        success: STATUS.SUCCESS,
        message: MESSAGE.OTP_SENT,
        adminId: newAdmin._id,
      });
    }

    return res.status(HTTP_CODE.SUCCESS).json({
      success: STATUS.SUCCESS,
      message: MESSAGE.LOGIN_OTP_SENT,
      adminId: admin._id,
    });
  } catch (err: unknown) {
    return res.status(HTTP_CODE.SERVER_ERROR).json({
      success: STATUS.FAIL,
      message: MESSAGE.SERVER_ERROR,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const getAdmins = async (_req: Request, res: Response) => {
  try {
    const admins = await adminService.fetchAdmins();
    res
      .status(HTTP_CODE.SUCCESS)
      .json({ success: STATUS.SUCCESS, data: admins });
  } catch (err: unknown) {
    res.status(HTTP_CODE.SERVER_ERROR).json({
      success: STATUS.FAIL,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const getAdminById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(HTTP_CODE.BAD_REQUEST)
        .json({ success: STATUS.FAIL, message: MESSAGE.ADMIN_ID_REQUIRED });
    }

    const admin = await adminService.fetchAdminById(id);
    return res.status(HTTP_CODE.SUCCESS).json({
      success: STATUS.SUCCESS,
      data: admin,
      message: MESSAGE.ADMIN_FETCHED,
    });
  } catch (err: unknown) {
    return res.status(404).json({
      success: STATUS.FAIL,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const updateAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(HTTP_CODE.BAD_REQUEST)
        .json({ success: STATUS.FAIL, error: "Admin ID is required" });
    }

    const admin = await adminService.updateAdminById(id, req.body);
    return res.status(HTTP_CODE.SUCCESS).json({
      success: STATUS.SUCCESS,
      message: "Admin updated successfully",
      data: admin,
    });
  } catch (err: unknown) {
    return res.status(HTTP_CODE.BAD_REQUEST).json({
      success: STATUS.FAIL,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(HTTP_CODE.BAD_REQUEST)
        .json({ success: STATUS.FAIL, error: "Admin ID is required" });
    }

    await adminService.deleteAdminById(id);
    return res
      .status(HTTP_CODE.SUCCESS)
      .json({ success: STATUS.SUCCESS, message: "Admin deleted successfully" });
  } catch (err: unknown) {
    res.status(HTTP_CODE.BAD_REQUEST).json({
      success: STATUS.FAIL,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};
