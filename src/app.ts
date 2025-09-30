import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
// import

dotenv.config();

const app = express();

app.use(express.json());

connectDB();
// app.use("/api/v1", adminRoutes);

export default app;
