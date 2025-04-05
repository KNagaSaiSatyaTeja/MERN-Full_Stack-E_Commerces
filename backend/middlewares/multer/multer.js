import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/users"));
  },
  filename: (req, file, cb) => {
    const today = new Date().toISOString().split("T")[0];
    const uniqueSuffix = today + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/products"));
  },
  filename: (req, file, cb) => {
    const today = new Date().toISOString().split("T")[0];
    const uniqueSuffix = today + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      "Error: File upload only supports the following filetypes - " + filetypes
    );
  }
};
const userUpload = multer({
  storage: userStorage,
  limits: { fileSize: 5000000 },
  fileFilter: fileFilter,
});

const productUpload = multer({
  storage: productStorage,
  limits: { fileSize: 5000000 },
  fileFilter: fileFilter,
});

export { productUpload, userUpload };
