import express from "express";
import {
  deleteUser,
  editUser,
  getAllUser,
  getUserByEmail,
  getUserById,
  postUSer,
  loginUser,
} from "../controller/user.controller.js";
import { userUpload } from "../middlewares/multer/multer.js";
import {
  createUserValidator,
  updateUserValidator,
  emailValidator,
  idValidator,
} from "../validators/userValidator.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { authenticateToken, requireAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.post(
  "/create",
  userUpload.single("image"),
  createUserValidator,
  validateRequest,
  postUSer
);

router.post("/login", loginUser);

// Protected routes
router.get("/", authenticateToken, requireAdmin, getAllUser);

router.get("/byEmail", emailValidator, validateRequest, getUserByEmail);

router.get("/byUserId/:id", idValidator, validateRequest, getUserById);

router.patch(
  "/update/:id",
  authenticateToken,
  userUpload.single("image"),
  updateUserValidator,
  validateRequest,
  editUser
);

router.delete("/delete/:id", authenticateToken, requireAdmin, idValidator, validateRequest, deleteUser);

export default router;
