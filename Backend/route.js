import express from "express";
import path from "path";
import cloudinary from "../src/cloudinary.js";
import DatauriParser from "datauri/parser.js";
import multer from "multer";
import sharp from "sharp"; // Import sharp for image processing

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const imagefile = req.file;
    let imageurl;

    if (imagefile.fieldname.startsWith("image")) {
      const processedImage = await processImage(imagefile.buffer);
      imageurl = await createImage(imagefile.originalname, processedImage);
    }
    console.log(imageurl);

    return res.send(imageurl);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Error uploading image");
  }
});

const processImage = async (buffer) => {
  try {
    const compressedImage = await sharp(buffer)
      .resize(800) // Resize the image to a maximum width of 800px (adjust as needed)
      .jpeg({ quality: 50 }) // Set JPEG quality (adjust as needed)
      .toBuffer(); // Convert the processed image to buffer
    return compressedImage;
  } catch (error) {
    console.log("Error processing image:", error);
    throw error;
  }
};

const createImage = async (name, buffer) => {
  try {
    const parser = new DatauriParser();
    const base64Image = parser.format(path.extname(name).toString(), buffer);

    const uploadedImageResponse = await cloudinary.uploader.upload(
      base64Image.content,
      { folder: "templates", resource_type: "image" }
    );
    return uploadedImageResponse.url;
  } catch (error) {
    console.log("Error uploading image to Cloudinary:", error);
    throw error;
  }
};

export default router;
