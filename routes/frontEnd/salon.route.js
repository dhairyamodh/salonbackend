const express = require('express');
const { salonController } = require('../../controllers/frontEnd')

const router = express.Router();

router.get('/', salonController.getSalonById)

module.exports = router;