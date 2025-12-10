// services/notification.service.ts
import User from "../../models/user/user.model";
import { Notification } from "../../models/notification/notification.model";
import { PromotionalNotification } from "../../models/admin/promoNotification.model";
import { sendPushNotification } from "../../utils/notification";

export const sendPromoNotificationService = async (
  title: string,
  body: string,
) => {
  // Fetch inactive users
  const users = await User.find({ isActive: false }).select("deviceToken");

  let sentCount = 0;

  for (const user of users) {
    if (user.deviceToken && user.deviceToken.trim() !== "") {
      await sendPushNotification(user.deviceToken, title, body);

      await Notification.create({
        userId: user._id,
        text: body,
      });

      sentCount++;
    }
  }

  // Store promo notification record
  const promo = await PromotionalNotification.create({
    title,
    body,
  });

  return {
    sentCount,
    totalUsers: users.length,
    savedPromo: promo,
  };
};
