import multer from 'multer';
// @ts-ignore
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bharat_venture_documents',
    allowed_formats: ['jpg', 'png', 'pdf', 'ppt', 'pptx'],
  } as any,
});

export const upload = multer({ storage });
