const express = require('express');
const { customerController } = require('../../../controllers/backEnd/salon')
const verify = require('../../../middlewares/verifyToken')

const router = express.Router();

router.get('/', verify, customerController.all)

module.exports = router;