const express = require('express');
const { serviceController } = require('../../controllers/frontEnd')
const router = express.Router();

router.get('/category/', serviceController.categoryServices)
router.get('/', serviceController.getServiceById)

module.exports = router;