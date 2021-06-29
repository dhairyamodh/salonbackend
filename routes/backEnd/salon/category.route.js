const express = require('express');
const { categoryController } = require('../../../controllers/backEnd/salon');
const upload = require('../../../multer/uploadCategoryImage')
const verify = require('../../../middlewares/verifyToken')

const router = express.Router();
router.post('/create', verify, upload.any(), categoryController.create);
router.get('/', categoryController.all)
router.put('/update', verify, upload.any(), categoryController.update);
router.delete('/delete', verify, categoryController.remove);
router.post('/import', verify, categoryController.importall)

module.exports = router;