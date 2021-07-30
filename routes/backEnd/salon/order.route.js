const express = require('express');
const { orderController } = require('../../../controllers/backEnd/salon')
const verify = require('../../../middlewares/verifyToken')

const router = express.Router();

router.get('/', verify, orderController.all)
router.post('/filteredorders', verify, orderController.getFilterBookings)
router.post('/create', verify, orderController.create);
router.put('/update', verify, orderController.update);
router.delete('/delete', verify, orderController.remove);

module.exports = router;