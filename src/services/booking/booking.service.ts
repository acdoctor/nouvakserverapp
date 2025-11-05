import moment from "moment";
import { Booking } from "../../models/booking/booking.model";
import Address from "../../models/user/address.model";
import { Service } from "../../models/service/service.model";
import User, { IUser } from "../../models/user/user.model";
import { sendPushNotification } from "../../utils/notification";
import { Notification } from "../../models/notification/notification.model";
import { Types } from "mongoose";

// Interface for Service Details
interface IServiceDetail {
  service_id: Types.ObjectId;
  serviceType?: string;
  quantity: string;
  acType?: string;
  place?: string;
  otherService?: string;
  comment?: string;
  services?: unknown[];
}

// Interface for Create Booking input
interface ICreateBookingInput {
  user_id: Types.ObjectId;
  serviceDetails: IServiceDetail[];
  addressId: Types.ObjectId;
  slot: "FIRST_HALF" | "SECOND_HALF";
  date: string | Date;
  amount: number | string;
  order_id?: string;
  name: string;
}

// Return type (simplified)
interface IBookingResponse {
  _id: Types.ObjectId;
  bookingId: string;
  user_id: Types.ObjectId;
  slot: string;
  date: Date;
}

export interface IBookingResponseById {
  _id: string;
  bookingId: string;
  user: IUser;
  technician?: Record<string, undefined>;
  addressDetails?: Record<string, undefined>;
  date: Date;
  slot: string;
  amount: number;
  status: string;
  order_id?: string;
  invoiceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  serviceDetails: Array<Record<string, undefined>>;
  orderItems: Array<Record<string, undefined>>;
}

// Service function to create a booking
export const createBooking = async (
  data: ICreateBookingInput,
): Promise<IBookingResponse> => {
  const {
    user_id,
    serviceDetails,
    addressId,
    slot,
    date,
    amount,
    order_id,
    name,
  } = data;

  // 1. Validate fields
  if (!user_id) throw new Error("User ID is required");
  if (!name) throw new Error("Name is required for booking");
  if (!addressId) throw new Error("Address ID is required");
  if (!slot) throw new Error("Slot is required");
  if (!date || isNaN(new Date(date).getTime())) throw new Error("Invalid date");
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    throw new Error("Invalid booking amount");
  }

  // 2. Verify address
  const address = await Address.findById(addressId);
  if (!address) throw new Error("Invalid Address ID");

  // 3. Generate booking ID
  const formattedDate = moment().format("DDMMYYYY");
  const countTotalBooking = await Booking.countDocuments();
  const bookingId = `ACDOCBK${formattedDate}-${countTotalBooking + 1}`;

  // 4. Prepare order items
  const orderItems: {
    item: string;
    quantity: string;
    price: number;
  }[] = [];

  for (const item of serviceDetails) {
    const findService = await Service.findById(item.service_id).select("name");
    if (!findService) continue;

    orderItems.push({
      item: `${findService.name} ${item.acType || ""}`.trim(),
      quantity: item.quantity,
      price: 0,
    });
  }

  // 5. Create booking
  const booking = new Booking({
    user_id,
    bookingId,
    serviceDetails,
    addressDetails: address,
    slot,
    date: new Date(date),
    amount: amount.toString(),
    order_id: order_id || "",
    orderItems,
  });

  const savedBooking = await booking.save();

  // 6. Send notification
  const user = await User.findById(user_id).select("deviceToken name");
  if (user) {
    if (!user.name) await User.updateOne({ _id: user_id }, { name });

    if (user.deviceToken) {
      const title = "Booking";
      const body = "Your booking has been successfully created!";
      await sendPushNotification(user.deviceToken, title, body);

      await Notification.create({
        userId: user_id,
        text: body,
      });
    }
  }

  //.eturn only the necessary booking details
  return {
    _id: savedBooking._id as Types.ObjectId,
    bookingId: savedBooking.bookingId,
    user_id: savedBooking.user_id,
    slot: savedBooking.slot,
    date: savedBooking.date,
  };
};

/**
 * Get booking details by bookingId with aggregation.
 */
export async function fetchBookingById(
  bookingId: string,
): Promise<IBookingResponse | null> {
  const bookingData = await Booking.aggregate([
    {
      $match: { _id: new Types.ObjectId(bookingId) },
    },
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user_info",
      },
    },
    { $unwind: { path: "$user_info", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$serviceDetails", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "services",
        localField: "serviceDetails.service_id",
        foreignField: "_id",
        as: "serviceDetails.service_data",
        pipeline: [
          { $project: { _id: 1, name: 1, icon: 1, category: 1, key: 1 } },
        ],
      },
    },
    {
      $unwind: {
        path: "$serviceDetails.service_data",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "technicians",
        localField: "assigned_to",
        foreignField: "_id",
        as: "technician_data",
      },
    },
    { $unwind: { path: "$technician_data", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: "$_id",
        bookingId: { $first: "$bookingId" },
        user: { $first: "$user_info" },
        technician: { $first: "$technician_data" },
        addressDetails: { $first: "$addressDetails" },
        date: { $first: "$date" },
        slot: { $first: "$slot" },
        amount: { $first: { $toDouble: "$amount" } },
        status: { $first: "$status" },
        order_id: { $first: "$order_id" },
        invoiceUrl: { $first: "$invoiceUrl" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        serviceDetails: {
          $push: {
            service_id: "$serviceDetails.service_id",
            service_data: "$serviceDetails.service_data",
            serviceType: "$serviceDetails.serviceType",
            quantity: "$serviceDetails.quantity",
            acType: "$serviceDetails.acType",
            place: "$serviceDetails.place",
            comment: "$serviceDetails.comment",
            otherService: { $ifNull: ["$serviceDetails.otherService", ""] },
            services: "$serviceDetails.services",
          },
        },
        orderItems: { $first: "$orderItems" },
      },
    },
  ]);

  if (!bookingData.length) return null;
  return bookingData[0] as IBookingResponse;
}
