const express = require('express');
const { serviceController } = require('../../../controllers/backEnd/salon')
const upload = require('../../../multer/uploadServiceImage')

const router = express.Router();

router.get('/', serviceController.all)
router.post('/create', upload.any(), serviceController.create);
router.put('/update', upload.any(), serviceController.update);
router.post('/import', serviceController.importall);
router.delete('/delete', serviceController.remove);

module.exports = router;