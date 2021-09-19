const express = require('express');
const branch = require('./branch.route')
const router = express.Router();
const verify = require('../../../middlewares/verifyToken')
const salonuser = require('./salonuser.route')
const category = require('./category.route')
const services = require('./service.route')
const userGroup = require('./salonusergroup.route')
// const hotkey = require('./hotkey.route')
const chair = require('./chair.route')
const order = require('./order.route')
const customer = require('./customer.route')
const user = require('./user.route')
const report = require('./report.route')
// const expensetype = require('./expensetype.route')
const expense = require('./expense.route')
const dashboard = require('./dashboard.route')
const offers = require('./offers.route')
const deals = require('./deals.route')

router.use('/branches', verify, branch);
router.use('/employees', verify, salonuser);
router.use('/category', category);
router.use('/services', verify, services);
router.use('/userGroup', verify, userGroup);
// router.use('/hotkeys', verify, hotkey);
router.use('/chairs', verify, chair);
router.use('/orders', verify, order);
router.use('/customers', verify, customer);
router.use('/users', verify, user);
router.use('/reports', verify, report);
// router.use('/expensetype', verify, expensetype);
router.use('/expenses', verify, expense);
router.use('/dashboard', verify, dashboard);
router.use('/offers', verify, offers);
router.use('/deals', verify, deals);

module.exports = router;
