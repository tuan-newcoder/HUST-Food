const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/hust-food";

  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);

    return conn;
  } catch (error) {
    console.error(
      "[Database Error] Không thể kết nối MongoDB. " +
        "Kiểm tra MONGODB_URI và quyền truy cập Atlas.",
    );

    process.exit(1);
  }
};

module.exports = connectDB;
