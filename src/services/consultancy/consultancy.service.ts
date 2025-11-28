import moment from "moment";
import { Types } from "mongoose";
import {
  Consultancy,
  IConsultancy,
} from "../../models/consultancy/consultancy.model";
import Address from "../../models/user/address.model";
import User from "../../models/user/user.model";
import { Notification } from "../../models/notification/notification.model";
import { uploadToS3 } from "../../utils/s3.utils";
import { sendPushNotification } from "../../utils/notification";

export interface ConsultancyPayload {
  user_id: string;
  brandId: string;
  quantity?: string;
  comment?: string;
  place?: string;
  addressId: string;
  slot: string;
  date: string;
  alternatePhone?: string;
  file?: Express.Multer.File | undefined;
}

export const createConsultancyService = async (payload: ConsultancyPayload) => {
  const {
    user_id,
    brandId,
    quantity,
    comment,
    place,
    addressId,
    slot,
    date,
    alternatePhone,
    file,
  } = payload;

  // Validate address
  const address = await Address.findById(addressId);
  if (!address) {
    throw new Error("Valid Address ID required");
  }

  // Generate consultancy ID
  const totalConsultancies = await Consultancy.countDocuments();
  const seq = String(totalConsultancies + 1).padStart(5, "0");
  const formattedDate = moment().format("DDMMYYYY");
  const consultancyId = `CONS-${formattedDate}-${seq}`;

  // Upload to S3 if file present
  let fileUrl: string | null = null;
  if (file) {
    const params = {
      Bucket: process.env.BUCKET_NAME!,
      Key: `consultancies/${consultancyId}/${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const uploadResult = await uploadToS3(params);
    fileUrl = uploadResult.Location;
  }

  // Create Consultancy Entry
  await Consultancy.create({
    user_id: new Types.ObjectId(user_id),
    brandId: new Types.ObjectId(brandId),
    consultancyId,
    addressDetails: address,
    slot,
    alternatePhone,
    date,
    quantity,
    comment,
    place,
    documentURL: fileUrl,
  });

  // Send Push Notification
  const user = await User.findById(user_id).select("deviceToken");
  if (user?.deviceToken) {
    await sendPushNotification(
      user.deviceToken,
      "📦 Consultation request recieved",
      "Your free consultancy request has been submitted.",
    );

    await Notification.create({
      userId: user_id,
      text: "Your free consultancy request has been submitted.",
    });
  }

  return { message: "Request submitted successfully" };
};

export const getConsultancyDetailsService = async (
  consultancyId: string,
): Promise<IConsultancy | null> => {
  if (!Types.ObjectId.isValid(consultancyId)) {
    throw new Error("INVALID_ID");
  }

  const consultancy = await Consultancy.findById(consultancyId).populate(
    "brandId",
    "name",
  );

  return consultancy;
};
