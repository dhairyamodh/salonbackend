const express = require('express');
const { reportController } = require('../../../controllers/backEnd/salon')

const router = express.Router();

router.post('/all', reportController.all)

module.exports = router;