const express = require('express');
const validate = require('../../../middlewares/validate');
const { themeController } = require('../../../controllers/backEnd/superadmin')

const router = express.Router();

router.get('/all', themeController.all);
router.post('/create', themeController.create);
router.put('/update', themeController.update);
router.delete('/delete', themeController.remove);

module.exports = router;