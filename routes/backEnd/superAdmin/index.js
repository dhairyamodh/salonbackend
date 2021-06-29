const express = require('express');
const salon = require('./salon.route')
const theme = require('./theme.route')
const subscription = require('./subscription.route')
const category = require('./category.route')
const expensetype = require('./expensetype.route')
const assignsubscription = require('./assignsubscription.route');
const currency = require('./currency.route');
const verify = require('../../../middlewares/verifyToken')
const router = express.Router();

router.use('/salons', salon);
router.use('/themes', verify, theme);
router.use('/subscriptions', verify, subscription);
router.use('/category', verify, category);
router.use('/expensetype', verify, expensetype);
router.use('/assignsubscription', verify, assignsubscription);
router.use('/currency', verify, currency);

module.exports = router;
