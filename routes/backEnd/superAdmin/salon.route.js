const express = require('express');
const { salonController } = require('../../../controllers/backEnd/superAdmin')
const upload = require('../../../multer/uploadLogo')
const verify = require('../../../middlewares/verifyToken')

const router = express.Router();

router.get('/all', verify, salonController.all);
router.get('/', salonController.getSalonById)
router.post('/create', verify, upload.any(), salonController.create);
// router.post('/create', upload.any(), salonController.create);
router.put('/update', verify, upload.any(), salonController.update);
router.delete('/delete', verify, salonController.remove);

module.exports = router;