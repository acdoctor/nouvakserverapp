import { Types } from "mongoose";
import { Booking } from "../../models/booking/booking.model";
// import { Technician } from "../../models/technician/technician.model";
// import { STATUS } from "../../Config/responseConstants";
import { generateInvoiceId } from "../../utils/invoiceUtils";
// import { uploadToS3 } from "../../Utils/s3";
import { calculateTotal } from "../../utils/calculateTotal";
// import moment from "moment";
import User from "../../models/user/user.model";
// import IUser from "../../models/user/user.model";

// const bucketName = process.env.BUCKET_NAME || "";

// Interfaces for clarity
interface OrderItem {
  item: string;
  quantity: number | string;
  price: number;
}

interface BookingData {
  _id: Types.ObjectId;
  user_id: string;
  bookingId: string;
  date: Date | string;
  addressDetails: string[];
  [key: string]: string | Types.ObjectId | Date | string[] | undefined;
}

/**
 * Creates a new invoice and updates booking with invoice data.
 */
export const createOrderItemRequest = async (
  bookingId: string,
  orderItems: OrderItem[],
  findBooking: BookingData,
): Promise<void> => {
  try {
    const invoiceId = await generateInvoiceId();

    const findUser = await User.findOne({
      _id: new Types.ObjectId(findBooking.user_id),
    });

    if (!findUser) {
      console.warn("⚠️ User not found for booking:", bookingId);
      return;
    }

    // const invoiceHTML = generateInvoice(orderItems, invoiceId, findBooking, findUser);

    // Optional PDF + Upload (uncomment if needed)
    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();
    // await page.setContent(invoiceHTML);
    // const pdfBuffer = await page.pdf({ format: 'A4' });
    // await browser.close();

    // const uploadParams = {
    //   Bucket: bucketName,
    //   Key: `booking/invoices/invoice_${invoiceId}.pdf`,
    //   Body: pdfBuffer,
    //   ContentType: 'application/pdf',
    // };

    // const data = await uploadToS3(uploadParams);

    const subtotal = calculateTotal(orderItems);

    await Booking.updateOne(
      { _id: bookingId },
      {
        $set: {
          status: "PAYMENT_PENDING",
          orderItems,
          // invoiceUrl: data.Location,
          invoiceUrl: `https://${process.env.BUCKET_NAME}/prod/sample.pdf`,
          amount: subtotal.toFixed(2),
        },
        $setOnInsert: {
          invoiceId,
        },
      },
      { upsert: false },
    );

    // TODO: Send notification or SMS to user and technician
  } catch (error) {
    console.error("❌ Error creating order item request:", error);
    throw error;
  }
};
