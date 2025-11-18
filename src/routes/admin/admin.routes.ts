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
import { updateKycSchema } from "../../validators/technician/KYCDoc.valitator";
import {
  technicianAssignedBookingListSchema,
  technicianIdParamValidator,
  technicianListValidator,
  technicianSchema,
  updateKycStatusValidator,
} from "../../validators/technician/technician.validator";

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

// Technician controllers routes
router.post(
  "/admin/technician/register",
  technicianController.registerTechnician,
);

router.post(
  "/admin/technician/kyc/manage/:technicianId",
  authenticate,
  validateRequest(updateKycSchema),
  technicianController.updateKyc,
);

router.post(
  "/admin/technician/kyc-status",
  authenticate,
  validateRequest(updateKycStatusValidator),
  technicianController.updateKycStatus,
);

router.post(
  "/admin/technician/status/:technicianId",
  authenticate,
  validateRequest(technicianIdParamValidator),
  technicianController.toggleTechnicianStatus,
);

router.post(
  "/admin/technician/:technicianId",
  authenticate,
  technicianController.getTechnicianById,
);

router.put(
  "/admin/technician/edit/:technicianId",
  authenticate,
  validateRequest(technicianSchema),
  technicianController.editTechnician,
);

router.post(
  "/admin/technician/list",
  authenticate,
  validateRequest(technicianListValidator),
  technicianController.technicianList,
);

router.get(
  "/admin/technician/list/available",
  authenticate,
  technicianController.getAvailableTechnicians,
);

router.get(
  "/admin/technician/assigned/booking/list/:technicianId",
  authenticate,
  validateRequest(technicianAssignedBookingListSchema),
  technicianController.technicianAssignedBookingList,
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
router.get("/admin/user/list", authenticate, userController.userList);
router.post(
  "/admin/user/toggle-active/:id",
  authenticate,
  userController.activeInactiveUser,
);

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

router.put(
  "/admin/booking/edit/:bookingId",
  authenticate,
  validateRequest(editBookingValidator),
  bookingController.editBooking,
);

router.get(
  "/admin/booking/list",
  validateRequest(bookingListValidator),
  authenticate,
  bookingController.bookingList,
);

router.get(
  "/admin/booking-list",
  authenticate,
  validateRequest(bookingListValidator),
  bookingController.ListOfBooking,
);

router.post(
  "/admin/booking/order-item/add-edit",
  validateRequest(addOrderItemValidator),
  authenticate,
  bookingController.addOrderItem,
);

router.get(
  "/admin/booking/generate-invoice/:bookingId",
  authenticate,
  bookingController.generateInvoice,
);

router.post(
  "/admin/booking/assign-technician",
  authenticate,
  bookingController.assignTechnician,
);

router.post(
  "/admin/booking/manage/status",
  authenticate,
  bookingController.manageBookingStatus,
);

export default router;
