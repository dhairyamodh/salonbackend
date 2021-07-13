const express = require("express");
const {
  categoryController,
} = require("../../../controllers/backEnd/superAdmin");
const upload = require("../../../multer/uploadCategoryImage");

const router = express.Router();

router.get("/", categoryController.all);
router.post("/create", upload.any(), categoryController.create);
router.put("/update", upload.any(), categoryController.update);
router.delete("/delete", categoryController.remove);

module.exports = router;
