import { body, validationResult } from "express-validator";

export const validateReport = [
  body("ngoId").trim().notEmpty().withMessage("NGO ID is required"),
  body("month")
    .matches(/^\d{4}-\d{2}$/)
    .withMessage("Month must be in YYYY-MM format"),
  body("peopleHelped")
    .isInt({ min: 0 })
    .withMessage("People helped must be a non-negative integer"),
  body("eventsConducted")
    .isInt({ min: 0 })
    .withMessage("Events conducted must be a non-negative integer"),
  body("fundsUtilized")
    .isFloat({ min: 0 })
    .withMessage("Funds utilized must be a non-negative number"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];
