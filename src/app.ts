import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db";
import adminRoutes from "./routes/admin/admin.routes";
import otpRoutes from "./routes/otp/otp.routes";

const app = express();

app.use(express.json());

connectDB();
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/otp", otpRoutes);

export default app;
