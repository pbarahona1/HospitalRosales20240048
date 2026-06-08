import multer from "multer";
import {CloudinaryStorage} from "multer-storage-cloudinary"
import {v2 as cloudinary} from "cloudinary"
import { config } from "../../config.js";

cloudinary.config({
    cloud_name: config.cloudinary.cloudinary_name,
    api_key: config.cloudinary.cloudinary_Api_key,
    api_secret: config.cloudinary.cloudinary_Api_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: "Grupo 1B",
        allowed_format:["jpg", "png", "jpeg", "gif"]
    }
})

const upload = multer({storage})

export default upload