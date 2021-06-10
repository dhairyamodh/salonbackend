const express = require('express');
const validate = require('../../../middlewares/validate');
const { branchController } = require('../../../controllers/backEnd/salon')
const { branchValidation } = require('../../../validations/backEnd/superAdmin')

const router = express.Router();

router.get('/', branchController.getBranchBySalonId);
router.post('/create', validate(branchValidation.create), branchController.create);
router.put('/update', validate(branchValidation.update), branchController.update);
router.delete('/delete', branchController.remove);

module.exports = router;