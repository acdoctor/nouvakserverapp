import { Request, Response } from "express";
import {
  createBooking,
  editBookingService,
  fetchBookingById,
} from "../../services/booking/booking.service";

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
    console.error("Error fetching booking:", err);
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

    const updatedBooking = await editBookingService({
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
    console.error("Error updating booking:", error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};
