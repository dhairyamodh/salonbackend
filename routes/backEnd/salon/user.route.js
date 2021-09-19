const express = require('express');
const { userController } = require('../../../controllers/backEnd/salon')
const verify = require('../../../middlewares/verifyToken')

const router = express.Router();

router.get('/', verify, userController.all)

module.exports = router;