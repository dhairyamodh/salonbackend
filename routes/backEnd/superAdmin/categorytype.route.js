const express = require('express');
const { categoryTypeController } = require('../../../controllers/backEnd/superadmin')
const upload = require('../../../multer/uploadCategoryImage')

const router = express.Router();

router.get('/', categoryTypeController.all);
router.post('/create', upload.any(), categoryTypeController.create);
router.put('/update', upload.any(), categoryTypeController.update);
router.delete('/delete', categoryTypeController.remove);

module.exports = router;