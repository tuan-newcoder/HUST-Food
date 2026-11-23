import express from "express";
import cors from "cors";
import placeRoutes from "./routes/place.route";

const app = express();

// Cho phép Frontend gọi API
app.use(cors());

// Cho phép Server nhận dữ liệu JSON
app.use(express.json());

// API kiểm tra Server
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HUST-Food Backend is running",
  });
});

// Đăng ký API quán ăn
app.use("/api/v1/places", placeRoutes);

export default app;
