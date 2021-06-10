const { branchSchema } = require('./Branch.model');
const { salonCategorySchema } = require('./saloncategory.model')
const { branchCategorySchema } = require('./Branchcategory.model')
const { salonServiceSchema } = require('./salonservice.model')
const { branchServiceSchema } = require('./branchservice.model')
const { salonUserSchema } = require('./salonuser.model')
const { orderSchema } = require('./order.model')

module.exports = {
    Branch: branchSchema,
    SalonCategory: salonCategorySchema,
    BranchCategory: branchCategorySchema,
    SalonService: salonServiceSchema,
    BranchService: branchServiceSchema,
    SalonUser: salonUserSchema,
    Order: orderSchema
}