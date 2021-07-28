const express = require("express");
const {
  expenseController,
} = require("../../../controllers/backEnd/salon");

const router = express.Router();

router.get("/", expenseController.all);
router.post("/create", expenseController.create);
router.put("/update", expenseController.update);
router.delete("/delete", expenseController.remove);

module.exports = router;
