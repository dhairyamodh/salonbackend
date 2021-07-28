const express = require('express');
const { offersController } = require('../../../controllers/backEnd/salon');
const upload = require('../../../multer/uploadOfferImage')
const verify = require('../../../middlewares/verifyToken')

const router = express.Router();
router.post('/create', verify, upload.any(), offersController.create);
router.get('/', offersController.all)
router.put('/update', verify, upload.any(), offersController.update);
router.delete('/delete', verify, offersController.remove);
router.post('/import', verify, offersController.importall)

module.exports = router;