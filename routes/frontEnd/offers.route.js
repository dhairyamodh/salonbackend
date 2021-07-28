const express = require('express');
const { offersController } = require('../../controllers/frontEnd');

const router = express.Router();
router.get('/', offersController.all)

module.exports = router;