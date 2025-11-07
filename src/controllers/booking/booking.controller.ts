import { Request, Response } from "express";
import {
  createBooking,
  updateBooking,
  fetchBookingById,
  fetchBookingList,
  createOrderItem,
  createInvoice,
} from "../../services/booking/booking.service";
// import { Booking } from "../../models/booking/booking.model";

// Controller to add a new booking
export const addBookingController = async (req: Request, res: Response) => {
  try {
    const booking = await createBooking(req.body);

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  const { bookingId } = req.params;

  if (!bookingId?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Booking ID is required",
    });
  }

  try {
    const booking = await fetchBookingById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err: unknown) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const editBooking = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { bookingId } = req.params;
    const { serviceDetails, addressId, slot, date, amount } = req.body;

    // Basic validation before service call
    if (!bookingId?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }
    if (!addressId?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Address ID is required",
      });
    }
    if (!slot?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Slot is required",
      });
    }

    const updatedBooking = await updateBooking({
      bookingId,
      serviceDetails,
      addressId,
      slot,
      date,
      amount,
    });

    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking updated successfully",
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

// Controller to get list of bookings with filters, pagination, and sorting
export const bookingList = async (req: Request, res: Response) => {
  try {
    const result = await fetchBookingList(req.query);

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: result.data,
      count: result.count,
      pagination: result.pagination,
    });
  } catch (error: unknown) {
    console.error("Error fetching booking list:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Controller to add order items to a booking
export const addOrderItem = async (req: Request, res: Response) => {
  try {
    const { bookingId, orderItem } = req.body;

    if (!bookingId?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Booking ID is required" });
    }

    if (!Array.isArray(orderItem) || orderItem.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Order items are required" });
    }

    await createOrderItem(bookingId, orderItem);

    return res
      .status(200)
      .json({ success: true, message: "Order items added successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Invalid booking ID") {
        return res.status(400).json({ success: false, message: error.message });
      }

      if (error.message === "Booking not found") {
        return res.status(404).json({ success: false, message: error.message });
      }

      return res.status(500).json({ success: false, message: error.message });
    }

    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

// Controller to generate invoice for a booking invoice
export const generateInvoice = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { bookingId } = req.params;

    if (bookingId) await createInvoice(bookingId);
    // await createInvoice(bookingId);

    return res.status(200).json({
      success: true,
      message: "Invoice generated successfully",
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while generating the invoice",
    });
  }
};
