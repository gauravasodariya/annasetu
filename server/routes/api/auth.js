const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const authController = require("../../controller/authController");

router.get("/", auth, authController.getLoggedInUser);


router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  authController.login
);

router.post("/google", authController.googleLogin);

router.post("/forgot-password", authController.forgotPassword);

router.get("/reset-password/:token", authController.verifyResetToken);

router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;
