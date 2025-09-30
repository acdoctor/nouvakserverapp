import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
// import

dotenv.config();

const app = express();

connectDB();

app.use(express.json());

// app.use("/api/v1", adminRoutes);

export default app;
