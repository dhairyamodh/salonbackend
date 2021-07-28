const express = require('express');
const { dealsController } = require('../../../controllers/backEnd/salon');
const verify = require('../../../middlewares/verifyToken')

const router = express.Router();
router.post('/create', verify, dealsController.create);
router.get('/', dealsController.all)
router.put('/update', verify, dealsController.update);
router.delete('/delete', verify, dealsController.remove);
router.post('/import', verify, dealsController.importall)

module.exports = router;