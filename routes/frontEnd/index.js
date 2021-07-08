const express = require('express');
const auth = require('./auth.route')
const salon = require('./salon.route')
const category = require('./category.route')
const service = require('./service.route')
const cart = require('./cart.route')
const checkout = require('./order.route')
const router = express.Router();

router.use('/', auth);
router.use('/salons', salon);
router.use('/category', category);
router.use('/services', service);
router.use('/cart', cart);
router.use('/checkout', checkout);

module.exports = router;
