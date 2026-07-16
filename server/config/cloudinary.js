const cloudinary = require("cloudinary").v2;

// Check if credentials are mock placeholders
const isMockMode =
  !process.env.CLOUDINARY_CLOUD_NAME ||
  process.env.CLOUDINARY_CLOUD_NAME === "your_cloud_name" ||
  process.env.CLOUDINARY_CLOUD_NAME.includes("placeholder");

if (!isMockMode) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Upload buffer stream to Cloudinary (or mock upload)
const uploadToCloudinary = (fileBuffer, originalname) => {
  return new Promise((resolve, reject) => {
    if (isMockMode) {
      const fs = require("fs");
      const path = require("path");
      console.log("[MOCK CLOUDINARY] Uploading file to local public/uploads directory:", originalname);
      try {
        const clientPublicDir = path.join(__dirname, "../../client/public");
        const uploadsDir = path.join(clientPublicDir, "uploads");
        
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        const fileExt = path.extname(originalname || ".png");
        const fileName = `upload_${Date.now()}_${Math.floor(Math.random() * 1000)}${fileExt}`;
        const filePath = path.join(uploadsDir, fileName);
        
        fs.writeFileSync(filePath, fileBuffer);
        
        return resolve({
          secure_url: `/uploads/${fileName}`,
          public_id: `mock_id_${Date.now()}`,
        });
      } catch (err) {
        console.error("Local mock upload failed, falling back to fake url:", err);
        return resolve({
          secure_url: `https://res.cloudinary.com/mock-cloud/image/upload/v${Date.now()}/${originalname || "upload.png"}`,
          public_id: `mock_id_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        });
      }
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "ecommerce",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );

    // End the upload stream with the buffer contents
    uploadStream.end(fileBuffer);
  });
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  isMockMode,
};
