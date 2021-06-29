const express = require("express");
const validate = require("../../middlewares/validate");
const authValidation = require("../../validations/auth.validation");
const verify = require("../../middlewares/verifyToken");
const { authController } = require("../../controllers/frontEnd/");
const router = express.Router();

router.post("/register", validate(authValidation.register), authController.register);
router.post("/login", validate(authValidation.login), authController.login);
router.get("/details", verify, authController.details);
router.post("/forgotpassword", authController.forgotpassword);
router.put("/forgotpassword", authController.changeForgotPassword);

module.exports = router;
