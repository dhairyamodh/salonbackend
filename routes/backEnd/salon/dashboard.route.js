const express = require('express');
const { dashboardController } = require('../../../controllers/backEnd/salon')

const router = express.Router();

router.post('/', dashboardController.all)

module.exports = router;