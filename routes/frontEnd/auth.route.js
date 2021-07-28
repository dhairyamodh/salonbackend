const express = require("express");
const validate = require("../../middlewares/validate");
const verify = require("../../middlewares/verifyToken");
const { authController } = require("../../controllers/frontEnd/");
const router = express.Router();
const { authValidation } = require('../../validations/backEnd/superAdmin')


router.post("/register", validate(authValidation.register), authController.register);
router.post("/login", validate(authValidation.login), authController.login);
router.get("/details", verify, authController.details);
router.post("/forgotpassword", authController.forgotpassword);
router.put("/forgotpassword", authController.changeForgotPassword);
router.post("/updateDetails", validate(authValidation.updateDetails), authController.updateDetails);
router.get("/getBookings", verify, authController.getBookings);

module.exports = router;
