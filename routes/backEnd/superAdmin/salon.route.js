const express = require('express');
const { salonController } = require('../../../controllers/backEnd/superAdmin')
const upload = require('../../../multer/uploadLogo')

const router = express.Router();

router.get('/all', salonController.all);
router.post('/create', upload.any(), salonController.create);
// router.post('/create', upload.any(), salonController.create);
router.put('/update', upload.any(), salonController.update);
router.delete('/delete', salonController.remove);

module.exports = router;