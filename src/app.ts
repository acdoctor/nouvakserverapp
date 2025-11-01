import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/admin/admin.routes";
import technicianRoutes from "./routes/technician/technician.routes";
import userRoutes from "./routes/user/user.routes";

const app = express();

app.use(express.json());
app.use(cookieParser());

connectDB();
app.use("/api/v1", adminRoutes, technicianRoutes, userRoutes);

export default app;
