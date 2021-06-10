const express = require('express');
const { assignSubscriptionController } = require('../../../controllers/backEnd/superadmin')

const router = express.Router();

router.post('/', assignSubscriptionController.create);
router.delete('/', assignSubscriptionController.remove);

module.exports = router;