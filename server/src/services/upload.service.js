const cloudinary = require('../config/cloudinary');

const uploadImageToCloudinary = (fileBuffer, originalname) => {
  return new Promise((resolve, reject) => {
    // If Cloudinary is not configured or in testing environment without real credentials
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name' ||
      process.env.CLOUDINARY_CLOUD_NAME === 'demo_cloud'
    ) {
      // Mock Cloudinary URL for local development/test
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const mockUrl = `https://res.cloudinary.com/hustfood/image/upload/v1/mock_${uniqueSuffix}_${originalname}`;
      return resolve(mockUrl);
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'hust-food',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

const uploadMultipleImages = async (files) => {
  if (!files || files.length === 0) {
    throw new Error('Không có file ảnh nào được tải lên');
  }

  const uploadPromises = files.map((file) =>
    uploadImageToCloudinary(file.buffer, file.originalname)
  );

  return await Promise.all(uploadPromises);
};

module.exports = {
  uploadImageToCloudinary,
  uploadMultipleImages,
};
