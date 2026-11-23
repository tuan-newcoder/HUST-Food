import "dotenv/config";
import app from "./app";
import { connectDB } from "./config/db";

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    // Bước 1: Kết nối MongoDB
    await connectDB();

    // Bước 2: Kết nối thành công mới chạy Express
    app.listen(PORT, () => {
      console.log(`HUST-Food Backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Không thể khởi động Backend:", error);
    process.exitCode = 1;
  }
};

startServer();
