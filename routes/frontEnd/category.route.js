const express = require('express');
const { categoryController } = require('../../controllers/frontEnd');

const router = express.Router();
router.get('/', categoryController.all)

module.exports = router;