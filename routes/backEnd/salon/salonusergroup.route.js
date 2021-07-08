const express = require('express');
const validate = require('../../../middlewares/validate');
const { salonUserGroupController } = require('../../../controllers/backEnd/salon')

const router = express.Router();

router.get('/', salonUserGroupController.all);
router.post('/create', salonUserGroupController.create);
router.put('/update', salonUserGroupController.update);
router.delete('/delete', salonUserGroupController.remove);

module.exports = router;