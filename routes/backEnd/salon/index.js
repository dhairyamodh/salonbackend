const express = require('express');
const branch = require('./branch.route')
const router = express.Router();
const verify = require('../../../middlewares/verifyToken')
const salonuser = require('./salonuser.route')
const category = require('./category.route')
const services = require('./service.route')
// const hotkey = require('./hotkey.route')
// const table = require('./table.route')
// const order = require('./order.route')
// const report = require('./report.route')
// const expensetype = require('./expensetype.route')
// const expense = require('./expense.route')
const dashboard = require('./dashboard.route')

router.use('/branches', verify, branch);
router.use('/users', verify, salonuser);
router.use('/category', category);
router.use('/services', verify, services);
// router.use('/hotkeys', verify, hotkey);
// router.use('/tables', verify, table);
// router.use('/orders', verify, order);
// router.use('/reports', verify, report);
// router.use('/expensetype', verify, expensetype);
// router.use('/expenses', verify, expense);
router.use('/dashboard', verify, dashboard);

module.exports = router;
