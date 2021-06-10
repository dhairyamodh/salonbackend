const express = require('express');
const validate = require('../../../middlewares/validate');
const { salonUserController } = require('../../../controllers/backEnd/salon')
const { salonValidation } = require('../../../validations/backEnd/superAdmin')

const router = express.Router();

router.get('/', salonUserController.all);
router.post('/create', validate(salonValidation.create), salonUserController.create);
router.put('/update', validate(salonValidation.update), salonUserController.update);
router.delete('/delete', salonUserController.remove);

module.exports = router;