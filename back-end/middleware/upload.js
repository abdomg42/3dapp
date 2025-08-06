import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create upload directory if it doesn't exist
const uploadDir = './upload';
const imagesDir = './upload/images';
const filesDir = './upload/files';
const random  = Math.round(Math.random() * 1E9);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir, { recursive: true });
}

// Configure storage for images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + random;
    cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure storage for product files
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, filesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + random;
    cb(null, 'file-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// File filter for product files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /3ds|zip|rar|obj|fbx|dae|blend|max|ma|mb|stl|ply|wrl|vrml|3dm|skp|dwg|dxf|iges|step|stp|iges|stp|sat|sab|jt|catpart|catproduct|cgr|asm|prt|drw|frm|sim|fem|mfg|mnf|mfg|mnf|sim|fem|frm|drw|prt|asm|cgr|catproduct|catpart|jt|sat|sab|stp|step|iges|dxf|dwg|skp|3dm|vrml|wrl|ply|stl|mb|ma|max|blend|dae|fbx|obj|3ds/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only 3D model files are allowed!'), false);
  }
};

// File filter for texture files
const textureFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|bmp|tga|tiff|psd|dds|ktx|pvr|hdr|exr/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only texture files are allowed!'), false);
  }
};

// Create multer instances
export const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export const uploadFile = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// Combined upload for image, multiple model files, and multiple texture files
export const uploadProduct = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'image') {
        cb(null, imagesDir);
      } else if (file.fieldname === 'modelFiles' || file.fieldname === 'textureFiles') {
        cb(null, filesDir); // Store all files in files directory
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      let prefix;
      if (file.fieldname === 'image') {
        prefix = 'image-';
      } else if (file.fieldname === 'modelFiles') {
        prefix = 'model-';
      } else if (file.fieldname === 'textureFiles') {
        prefix = 'texture-';
      }
      cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'image') {
      return imageFilter(req, file, cb);
    } else if (file.fieldname === 'modelFiles') {
      return fileFilter(req, file, cb);
    } else if (file.fieldname === 'textureFiles') {
      return textureFilter(req, file, cb);
    }
    cb(new Error('Invalid field name'), false);
  },
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
}); 