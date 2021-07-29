const express = require('express');
const { chairController } = require('../../../controllers/backEnd/salon')

const router = express.Router();

router.get('/', chairController.all)
router.post('/create', chairController.create);
router.put('/update', chairController.update);
router.delete('/delete', chairController.remove);

module.exports = router;