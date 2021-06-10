const express = require('express');
const { salonCategoryController } = require('../../../controllers/backEnd/salon');
const upload = require('../../../multer/uploadCategoryImage')

const router = express.Router();
router.post('/create', upload.any(), salonCategoryController.create);
router.get('/', salonCategoryController.all)
router.put('/update', upload.any(), salonCategoryController.update);
router.delete('/delete', salonCategoryController.remove);
router.post('/import', salonCategoryController.importall)

module.exports = router;