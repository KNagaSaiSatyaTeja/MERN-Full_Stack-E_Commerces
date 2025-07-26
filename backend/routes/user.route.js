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

router.post(
  "/create",
  userUpload.single("image"),
  createUserValidator,
  validateRequest,
  postUSer
);

router.get("/", getAllUser);

router.get("/byEmail", emailValidator, validateRequest, getUserByEmail);

router.get("/byUserId/:id", idValidator, validateRequest, getUserById);

router.patch(
  "/update/:id",
  userUpload.single("image"),
  updateUserValidator,
  validateRequest,
  editUser
);

router.delete("/delete/:id", idValidator, validateRequest, deleteUser);

export default router;
