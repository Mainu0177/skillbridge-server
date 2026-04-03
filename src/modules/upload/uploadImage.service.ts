
import { Request } from "express";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

import cloudinary from "../../config/cloudinary.config";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req: Request, file) => {
        return {
        folder: "skill-bridge-asset", 
        format: "webp",
        public_id: file.originalname.split(".")[0] + "-" + Date.now(),
        transformation: [{ width: 1024, height: 1024, crop: "limit" }],
        };
    },
});

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
        } else {
        cb(new Error("Invalid file type. Only JPEG, PNG, WEBP allowed."));
        }
    },
});
