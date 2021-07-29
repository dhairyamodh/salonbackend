const { Salon, Theme } = require("../models/backEnd/superAdmin");

const getUserBranchCode = async (user) => {
    if (user.branchId) {
        const branch = await global.salons[user.salonId].Branch.findById(user.branchId);
        const order = await global.salons[user.salonId].Order.find({ branchId: user.branchId }).sort({ _id: -1 }).limit(1)
        user._doc.branchCode = branch.branchCode
        user._doc.branchName = branch.branchName
        const salon = await Salon.findById(user.salonId)
        const theme = await Theme.findById(salon.themeId);
        user._doc.cgst = salon.cgst
        user._doc.sgst = salon.sgst
        user._doc.salonName = salon.name
        user._doc.salonLogo = salon.logo
        user._doc.primaryColor = theme.primaryColor
        user._doc.gstNumber = salon.gstNumber
        user._doc.secondaryColor = theme.secondaryColor
        if (order.length > 0) {
            user._doc.orderNumber = order[0].orderNumber
            user._doc.lastOrderTotal = order[0].grandTotal
        }
    } else if (user.salonId) {
        const salon = await Salon.findById(user.salonId)
        const theme = await Theme.findById(salon.themeId);
        user._doc.taxPercentage = salon.taxPercentage
        user._doc.salonName = salon.name
        user._doc.salonLogo = salon.logo
        user._doc.primaryColor = theme.primaryColor
        user._doc.secondaryColor = theme.secondaryColor
        user._doc.tagLine = salon.tagLine
        user._doc.balance = salon.balance
        user._doc.gstNumber = salon.gstNumber
        user._doc.contactPerson = salon.contactPerson
        user._doc.address = salon.address
        const order = await global.salons[user.salonId].Order.find().sort({ _id: -1 }).limit(1)
        if (order.length > 0) {
            user._doc.orderNumber = order[0].orderNumber
            user._doc.lastOrderTotal = order[0].grandTotal
        }
    }
    return user;
}

module.exports = getUserBranchCode