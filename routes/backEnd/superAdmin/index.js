const express = require('express');
const salon = require('./salon.route')
const theme = require('./theme.route')
const subscription = require('./subscription.route')
const categorytype = require('./categorytype.route')
const expensetype = require('./expensetype.route')
const assignsubscription = require('./assignsubscription.route');
const verify = require('../../../middlewares/verifyToken')
const router = express.Router();

router.use('/salons', verify, salon);
router.use('/themes', verify, theme);
router.use('/subscriptions', verify, subscription);
router.use('/categorytype', verify, categorytype);
router.use('/expensetype', verify, expensetype);
router.use('/assignsubscription', verify, assignsubscription);

module.exports = router;
