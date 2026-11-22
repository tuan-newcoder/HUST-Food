const mongoose = require('mongoose');

let memoryServerInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hust-food';

  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 2500, // Timeout fast if local MongoDB daemon is not running
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[Database Warning] Không thể kết nối tới MONGODB_URI (${uri}): ${error.message}`);

    // If local development environment, fallback to In-Memory MongoDB Server automatically
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log(`\n==================================================================`);
        console.log(`⚠️  Local MongoDB chưa được bật hoặc chưa cài đặt.`);
        console.log(`🚀  Đang tự động khởi tạo MongoDB In-Memory Server cho Development...`);
        
        const { MongoMemoryServer } = require('mongodb-memory-server');
        memoryServerInstance = await MongoMemoryServer.create();
        const memUri = memoryServerInstance.getUri();

        const conn = await mongoose.connect(memUri, {
          autoIndex: true,
        });

        console.log(`✅  Đã kết nối MongoDB In-Memory thành công!`);
        console.log(`👉  Server đã sẵn sàng. Bạn có thể test API ngay lập tức.`);
        console.log(`==================================================================\n`);
        return conn;
      } catch (memError) {
        console.error(`[Database Error] Không thể khởi tạo In-Memory MongoDB: ${memError.message}`);
      }
    }

    console.error(`[Database Error] Failed to connect: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
