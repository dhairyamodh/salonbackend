const express = require('express');
const { orderController } = require('../../controllers/frontEnd');
const validate = require('../../middlewares/validate');
const { orderValidation } = require('../../validations/backEnd/superAdmin');

const router = express.Router();

router.get('/getAvailableTime', orderController.getAvailableTime)
router.post('/create', validate(orderValidation.create), orderController.create)
router.get('/orderById', orderController.getOrderById)

module.exports = router;