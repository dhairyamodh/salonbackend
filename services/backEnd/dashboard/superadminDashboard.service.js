const httpStatus = require('http-status');
const moment = require('moment')
const { Salon } = require('../../../models/backEnd/superAdmin');
const getFormattedDate = (date, format) => {
    return moment(date).utcOffset("+05:30").format(format);
};

const getDashboard = async (db, data) => {
    try {
        const salon = await Salon.find({ status: 'true' })
        let branchCount = 0, userCount = 0, orderCount = 0

        await Promise.all(Object.values(global.salons).map(async (key) => {
            const currentBranch = await key.Branch.find({ status: true })
            branchCount = branchCount + currentBranch.length

            const users = await key.SalonUser.find({ status: true })
            userCount += users.length

            const orders = await key.Order.find()
            orderCount += orders.length
        }))
        const responseData = { activeRestaurants: salon.length, branchCount: branchCount, userCount: userCount, orderCount: orderCount }
        return ({ status: httpStatus.OK, data: { iconsgrid: responseData, } })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}


module.exports = {
    getDashboard
}