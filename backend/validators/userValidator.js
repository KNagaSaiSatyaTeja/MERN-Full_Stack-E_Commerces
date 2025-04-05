import { body, param, query } from "express-validator";

export const createUserValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("address").trim().notEmpty().withMessage("Address is required"),
];

export const updateUserValidator = [
  param("id").isMongoId().withMessage("Invalid user ID"),

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),

  body("address")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Address cannot be empty"),
];

export const emailValidator = [
  query("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),
];

export const idValidator = [
  param("id").isMongoId().withMessage("Invalid ID format"),
];
