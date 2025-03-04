import multer from 'multer';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Define Cloudinary storage settings
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'book-covers', // Cloudinary folder name
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{width: 500, height: 700, crop: 'limit'}]
  }
});

// Configure Multer
const upload = multer({storage});

export default upload;
