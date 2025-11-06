import { Router } from "express";
import * as adminController from "../../controllers/admin/admin.controller";
import * as otpController from "../../controllers/admin/otp.controller";
import * as authController from "../../controllers/admin/auth.controller";
import * as technicianController from "../../controllers/technician/technician.controller";
import * as userController from "../../controllers/user/user.controller";
import * as serviceController from "../../controllers/service/service.controller";
import * as bookingController from "../../controllers/booking/booking.controller";
import { authenticate } from "../../middlewares/admin/auth";
import { authSchema } from "../../validators/auth/auth.validator";
import { validateRequest } from "../../middlewares/request/validateRequest";
import { adminUpdateSchema } from "../../validators/admin/admin.validator";
import { updateUserSchema } from "../../validators/user/user.validator";
import {
  addServiceSchema,
  serviceListValidator,
} from "../../validators/service/service.validator";
import {
  addOrderItemValidator,
  bookingListValidator,
  createBookingSchema,
  editBookingValidator,
} from "../../validators/booking/booking.validator";

const router = Router();

// Admin controllers routes
router.post(
  "/admin/register",
  validateRequest(authSchema),
  adminController.registerAdmin,
);
router.post(
  "/admin/login",
  validateRequest(authSchema),
  adminController.loginRegisterAdmin,
);
router.post("/admin/resend-otp", otpController.resendOtp);
router.post("/admin/verify-otp", otpController.verifyOtp);
router.post("/admin/refresh", authController.refresh);
router.get("/admin/profile/:id", authenticate, adminController.getAdminById);
router.get("/admin/all/", authenticate, adminController.getAdmins);
router.delete("/admin/delete/:id", authenticate, adminController.deleteAdmin);
router.put(
  "/admin/update/:id",
  authenticate,
  validateRequest(adminUpdateSchema),
  adminController.updateAdmin,
);

router.post(
  "/admin/user/toggle-active/:id",
  authenticate,
  userController.activeInactiveUser,
);

router.get("/admin/user/list", authenticate, userController.userList);

// Technician controllers routes
router.post(
  "/admin/technician/register",
  technicianController.registerTechnician,
);

// User controllers routes
router.post("/admin/user/register", userController.registerUser);
router.get("/admin/user/profile/:id", authenticate, userController.getUserById);
router.get(
  "/admin/user/addresses-list/:userId",
  authenticate,
  userController.userAddressesList,
);
router.put(
  "/admin/user/update/:id",
  validateRequest(updateUserSchema),
  userController.updateUser,
);
router.delete("/admin/user/delete/:id", userController.deleteUser);

// Service controller routes
router.post(
  "/admin/service/add",
  authenticate,
  validateRequest(addServiceSchema),
  serviceController.addService,
);

router.put(
  "/admin/service/edit/:serviceId",
  authenticate,
  serviceController.editService,
);

router.get(
  "/admin/service/get/:serviceId",
  authenticate,
  serviceController.getServiceById,
);

router.post(
  "/admin/service/active-inactive/:serviceId",
  authenticate,
  serviceController.serviceActiveInactive,
);

router.get(
  "/admin/service/list",
  authenticate,
  validateRequest(serviceListValidator),
  serviceController.serviceList,
);

router.get(
  "/admin/service/mobile-list",
  authenticate,
  serviceController.mobileServiceList,
);

// Booking controller routes
router.post(
  "/admin/booking/add",
  validateRequest(createBookingSchema),
  authenticate,
  bookingController.addBookingController,
);

router.get(
  "/admin/booking/:bookingId",
  authenticate,
  bookingController.getBookingById,
);

router.post(
  "/admin/booking/edit/:bookingId",
  authenticate,
  validateRequest(editBookingValidator),
  bookingController.editBooking,
);

router.get(
  "/admin/booking/list/",
  validateRequest(bookingListValidator),
  authenticate,
  bookingController.bookingList,
);

router.post(
  "/admin/booking/order-item/add-edit",
  validateRequest(addOrderItemValidator),
  authenticate,
  bookingController.addOrderItem,
);

export default router;
