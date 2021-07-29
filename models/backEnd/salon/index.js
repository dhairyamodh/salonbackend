const { branchSchema } = require('./Branch.model');
const { salonCategorySchema } = require('./saloncategory.model')
const { branchCategorySchema } = require('./Branchcategory.model')
const { salonServiceSchema } = require('./salonservice.model')
const { branchServiceSchema } = require('./branchservice.model')
const { salonUserSchema } = require('./salonuser.model')
const { orderSchema } = require('./order.model');
const { customerSchema } = require('./customer.model');
const { cartSchema } = require('./Cart.model');
const { salonUserGroupSchema } = require('./salonusergroup.model');
const { expenseSchema } = require('./expense.model');
const { offersSchema } = require('./offers.model');
const { dealsSchema } = require('./deals.model');
const { chairSchema } = require('./chair.model');

module.exports = {
    Branch: branchSchema,
    SalonCategory: salonCategorySchema,
    BranchCategory: branchCategorySchema,
    SalonService: salonServiceSchema,
    BranchService: branchServiceSchema,
    SalonUser: salonUserSchema,
    Order: orderSchema,
    Customer: customerSchema,
    Cart: cartSchema,
    SalonUserGroup: salonUserGroupSchema,
    Expense: expenseSchema,
    Offers: offersSchema,
    Deals: dealsSchema,
    Chair: chairSchema
}