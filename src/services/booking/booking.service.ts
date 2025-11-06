import moment from "moment";
import { Booking } from "../../models/booking/booking.model";
import Address, { IAddress } from "../../models/user/address.model";
import { IService, Service } from "../../models/service/service.model";
import User, { IUser } from "../../models/user/user.model";
import { sendPushNotification } from "../../utils/notification";
import { Notification } from "../../models/notification/notification.model";
import { Types } from "mongoose";
import { ITechnician } from "../../models/technician/technician.model";
import { PipelineStage } from "mongoose";

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

export interface IOrderItem {
  _id: string;
  item: string;
  quantity: string;
  price: number;
}

export interface IBookingResponseById {
  _id: string;
  bookingId: string;
  user: IUser;
  technician?: ITechnician;
  addressDetails?: IAddress;
  date: Date;
  slot: string;
  amount: number;
  status: string;
  order_id?: string;
  invoiceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  serviceDetails: IService[];
  orderItems: IOrderItem[];
}

interface IEditBookingParams {
  bookingId: string;
  serviceDetails?: IServiceDetail[];
  addressId: IAddress;
  slot: "FIRST_HALF" | "SECOND_HALF";
  date: string;
  amount: number;
}

interface BookingQuery {
  page?: string;
  limit?: string;
  status?: string;
  search?: string;
  sortby?: string;
  orderby?: string;
  startDate?: string;
  endDate?: string;
  filter?: string;
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

  // 7. return only the necessary booking details
  return {
    _id: savedBooking._id as Types.ObjectId,
    bookingId: savedBooking.bookingId,
    user_id: savedBooking.user_id,
    slot: savedBooking.slot,
    date: savedBooking.date,
  };
};

// Service function to get booking details by bookingId with aggregation.
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

// Service function to update a booking
export const updateBooking = async ({
  bookingId,
  serviceDetails,
  addressId,
  slot,
  date,
  amount,
}: IEditBookingParams) => {
  // Check if booking exists
  const existingBooking = await Booking.findById(new Types.ObjectId(bookingId));
  if (!existingBooking) return null;

  // Check if address exists
  const address = await Address.findById(addressId);
  if (!address) throw new Error("Invalid address ID");

  // Update booking fields
  existingBooking.serviceDetails =
    serviceDetails || existingBooking.serviceDetails;
  existingBooking.addressDetails = [address];
  existingBooking.slot = slot;
  existingBooking.date = new Date(date);
  existingBooking.amount = new Types.Decimal128(amount.toString());

  await existingBooking.save();

  return existingBooking;
};

// Service function to get list of bookings with filters, pagination, and sorting

export const fetchBookingList = async (query: BookingQuery) => {
  const page = parseInt(query.page || "1", 10);
  const limit = parseInt(query.limit || "10", 10);
  const status = query.status ? query.status.split(",") : [];
  const search = query.search || "";
  const sortField = query.sortby || "createdAt";
  const sortOrder = query.orderby === "asc" ? 1 : -1;
  const startDate = query.startDate ? new Date(query.startDate) : null;
  const endDate = query.endDate ? new Date(query.endDate) : null;

  // Build $and conditions safely in a typed array
  const andConditions: NonNullable<PipelineStage.Match["$match"]["$and"]> = [
    {
      $or: [
        { bookingId: { $regex: search, $options: "i" } },
        { "user_info.phoneNumber": { $regex: search, $options: "i" } },
        { "technician_data.phoneNumber": { $regex: search, $options: "i" } },
        { "technician_data.name": { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
        { "user_info.name": { $regex: search, $options: "i" } },
        { "technician_data.status": { $regex: search, $options: "i" } },
      ],
    },
    {
      $or: [
        { status: { $in: status } },
        {
          $and: [
            { status: { $in: ["BOOKED", "IN_PROGRESS"] } },
            { $expr: { $eq: [status.length, 0] } },
          ],
        },
      ],
    },
  ];

  if (startDate && endDate) {
    andConditions.push({ date: { $gte: startDate, $lte: endDate } });
  } else if (startDate) {
    andConditions.push({ date: { $gte: startDate } });
  } else if (endDate) {
    andConditions.push({ date: { $lte: endDate } });
  }

  const matchConditions: PipelineStage.Match["$match"] = {
    $and: andConditions,
  };

  const offset = (page - 1) * limit;

  const basePipeline: PipelineStage[] = [
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user_info",
      },
    },
    { $unwind: { path: "$user_info", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "services",
        localField: "service_id",
        foreignField: "_id",
        as: "service_info",
      },
    },
    { $unwind: { path: "$service_info", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "technicians",
        localField: "assigned_to",
        foreignField: "_id",
        as: "technician_data",
      },
    },
    { $unwind: { path: "$technician_data", preserveNullAndEmptyArrays: true } },
    { $match: matchConditions },
  ];

  const bookings = await Booking.aggregate([
    ...basePipeline,
    { $sort: { [sortField]: sortOrder } },
    { $skip: offset },
    { $limit: limit },
    {
      $project: {
        address: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        user: {
          id: { $ifNull: ["$user_info._id", ""] },
          name: { $ifNull: ["$user_info.name", ""] },
          phoneNumber: { $ifNull: ["$user_info.phoneNumber", ""] },
          createdAt: { $ifNull: ["$user_info.createdAt", null] },
        },
        service: {
          id: { $ifNull: ["$service_info._id", ""] },
          name: { $ifNull: ["$service_info.name", ""] },
        },
        technicianName: { $ifNull: ["$technician_data", {}] },
        date: 1,
        amount: { $toDouble: "$amount" },
        order_id: 1,
        bookingId: 1,
        slot: 1,
      },
    },
  ]);

  const totalBookings = await Booking.aggregate([
    ...basePipeline,
    { $count: "total" },
  ]);

  const totalCount = totalBookings.length ? totalBookings[0].total : 0;

  return {
    data: bookings,
    count: totalCount,
    pagination: {
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

export const addOrderItemService = async (
  bookingId: string,
  orderItems: IOrderItem[],
) => {
  if (!Types.ObjectId.isValid(bookingId)) {
    throw new Error("Invalid booking ID");
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new Error("Booking not found");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cleanedOrderItems = orderItems.map(({ _id, ...rest }) => rest);

  const totalAmount = cleanedOrderItems.reduce((total, item) => {
    const price = Number(item.price);
    const quantity = parseInt(item.quantity, 10);
    return total + price * quantity;
  }, 0);

  await Booking.updateOne(
    { _id: bookingId },
    {
      orderItems: cleanedOrderItems,
      amount: totalAmount,
    },
  );

  return { success: true };
};
