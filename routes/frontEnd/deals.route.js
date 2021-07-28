const express = require('express');
const { dealsController } = require('../../controllers/frontEnd');

const router = express.Router();
router.get('/', dealsController.all)

module.exports = router;