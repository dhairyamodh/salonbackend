const express = require('express');
const { serviceController } = require('../../controllers/frontEnd')
const router = express.Router();

router.get('/trending', serviceController.trendingServices)
router.get('/category/', serviceController.categoryServices)
router.get('/', serviceController.getServiceById)
router.get('/search', serviceController.searchService)

module.exports = router;