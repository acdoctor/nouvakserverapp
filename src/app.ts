import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import adminRoutes from "./routes/admin/admin.routes";
import otpRoutes from "./routes/otp/otp.routes";

dotenv.config();

const app = express();

app.use(express.json());

connectDB();
app.use("/api/v1", adminRoutes);
app.use("/api/v1", otpRoutes);

export default app;
