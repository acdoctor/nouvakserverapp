// controllers/notification.controller.ts
import { Request, Response } from "express";
import {
  getAdminPromoNotificationListService,
  sendPromoNotificationService,
} from "../../services/admin/promoNotification.service";
export const sendPromoNotification = async (req: Request, res: Response) => {
  try {
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({
        success: false,
        message: "Title and body are required",
      });
    }

    const result = await sendPromoNotificationService(title, body);

    return res.status(200).json({
      success: true,
      message: "Promotional notification sent successfully",
      data: {
        sentCount: result.sentCount,
        totalUsers: result.totalUsers,
        savedPromoNotification: {
          id: result.savedPromo._id,
          title: result.savedPromo.title,
          body: result.savedPromo.body,
          createdAt: result.savedPromo.createdAt,
        },
      },
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const adminPromoNotificationList = async (
  req: Request,
  res: Response,
) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const search = (req.query.search as string)?.trim() || "";
    const sortField = (req.query.sortby as string) || "createdAt";
    const sortOrder: 1 | -1 = req.query.orderby === "asc" ? 1 : -1;

    const { notifications, total } = await getAdminPromoNotificationListService(
      page,
      limit,
      search,
      sortField,
      sortOrder,
    );

    return res.status(200).json({
      success: true,
      data: notifications,
      count: total,
      page,
      limit,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch promotional notifications",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
