const express = require('express');
const { currencyController } = require('../../../controllers/backEnd/superAdmin')

const router = express.Router();

router.get('/all', currencyController.all);
router.post('/create', currencyController.create);
router.put('/update', currencyController.update);
router.delete('/delete', currencyController.remove);

module.exports = router;