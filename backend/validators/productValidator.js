import { body, param } from "express-validator";

export const createProductValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number")
    .custom((value) => value > 0)
    .withMessage("Price must be greater than 0"),

  body("category").trim().notEmpty().withMessage("Category is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),
];

export const updateProductValidator = [
  param("id").isMongoId().withMessage("Invalid product ID"),

  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),

  body("price")
    .optional()
    .isNumeric()
    .withMessage("Price must be a number")
    .custom((value) => value > 0)
    .withMessage("Price must be greater than 0"),

  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),
];
