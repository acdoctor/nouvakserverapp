import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db";
import adminRoutes from "./routes/admin/admin.routes";
import authRoutes from "./routes/auth/auth.routes";

const app = express();

app.use(express.json());

connectDB();
app.use("/api/v1", adminRoutes);
app.use("/api/v1", authRoutes);

export default app;
