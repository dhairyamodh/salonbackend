const express = require("express");
const {
  subscriptionController,
} = require("../../../controllers/backEnd/superAdmin");

const router = express.Router();

router.get("/all", subscriptionController.all);
router.post("/create", subscriptionController.create);
router.put("/update", subscriptionController.update);
router.delete("/delete", subscriptionController.remove);

module.exports = router;
