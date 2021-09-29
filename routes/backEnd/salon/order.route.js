const express = require('express');
const { orderController } = require('../../../controllers/backEnd/salon')
const verify = require('../../../middlewares/verifyToken')

const router = express.Router();

router.get('/', verify, orderController.all)
router.post('/filteredorders', verify, orderController.getFilterBookings)
router.post('/create', verify, orderController.create);
router.post('/checkout', verify, orderController.checkoutOrder);
router.put('/update', verify, orderController.update);
router.delete('/delete', verify, orderController.remove);
router.post('/applyCoupon', orderController.applyCoupon)

module.exports = router;