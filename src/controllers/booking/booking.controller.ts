import { Request, Response } from "express";
import { createBooking } from "../../services/booking/booking.service";

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
