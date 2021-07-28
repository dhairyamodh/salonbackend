const httpStatus = require('http-status');
const moment = require('moment')
const getFormattedDate = (date, format) => {
    return moment(date).utcOffset("+05:30").format(format);
};

const getOrderReport = async (db, data) => {
    try {
        let startDate = getFormattedDate(data.date.start);
        const branchId = data.branchId != 'all' ? ObjectId(data.branchId) : undefined
        const response = await db.Order.find({
            "createdAt": {
                $gte: new Date(startDate).setHours(0, 0, 0, 0),
                $lte: new Date(startDate).setHours(23, 59, 59, 999),
            },
            // ...(branchId && { branchId: branchId })
        })
        const orderResponse = await Promise.all(response.map((value) => {
            return { ...value._doc, itemsLength: value._doc.orderItems.length }
        }))
        return ({ status: httpStatus.OK, data: { table: orderResponse } })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}


module.exports = {
    getOrderReport
}