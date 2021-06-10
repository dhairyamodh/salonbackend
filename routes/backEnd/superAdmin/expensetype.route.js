const express = require('express');
const { expenseTypeController } = require('../../../controllers/backEnd/superadmin')

const router = express.Router();

router.get('/all', expenseTypeController.all);
router.post('/create', expenseTypeController.create);
router.put('/update', expenseTypeController.update);
router.delete('/delete', expenseTypeController.remove);

module.exports = router;