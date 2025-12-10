// controllers/notification.controller.ts
import { Request, Response } from "express";
import { sendPromoNotificationService } from "../../services/admin/promoNotification.service";
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
