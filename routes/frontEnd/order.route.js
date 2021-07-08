const express = require('express');
const { orderController } = require('../../controllers/frontEnd')

const router = express.Router();

router.get('/getAvailableTime', orderController.getAvailableTime)

module.exports = router;