const express = require('express');
const { cartController } = require('../../controllers/frontEnd')
const router = express.Router();

router.get('/getCart', cartController.getCart)
router.post('/addToCart', cartController.addToCart)
router.post('/removeToCart', cartController.removeToCart)
router.post('/transferCart', cartController.transferCart)

module.exports = router;