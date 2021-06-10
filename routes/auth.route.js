const express = require("express");
const validate = require("../middlewares/validate");
const authValidation = require("../validations/auth.validation");
const verify = require("../middlewares/verifyToken");
const authController = require("../controllers/auth.controller");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const httpStatus = require("http-status");
const router = express.Router();

function delay(req, res, next) {
  setTimeout(() => {
    next();
  }, 5000);
}
router.post("/register", async (req, res) => {
  const data = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(data.password, salt);
  await User.create({ ...data, password: hashPassword });
  res.send({ status: httpStatus.OK, message: "Created admin" });
});
router.post("/login", validate(authValidation.login), authController.login);
router.get("/details", verify, authController.details);
router.post("/forgotpassword", authController.forgotpassword);
router.put("/forgotpassword", authController.changeForgotPassword);

module.exports = router;
