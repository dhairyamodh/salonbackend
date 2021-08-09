const httpStatus = require('http-status');
const moment = require('moment');
const { getToFix } = require('../../../commonFunction/functionList');
const getFormattedDate = (date, format) => {
    return moment(date).utcOffset("+05:30").format(format);
};

const getOrderReport = async (db, data) => {
    try {
        let startDate = getFormattedDate(data.date.start);
        let endDate = getFormattedDate(data.date.end);
        const branchId = data.branchId != 'all' ? ObjectId(data.branchId) : undefined
        const response = await db.Order.aggregate([
            {
                $match: {
                    // ...(branchId && { branchId: branchId }),
                    $and: [
                        {
                            "createdAt":
                            {
                                $gte: moment(data.date.start).startOf("day").toDate(),
                                $lte: moment(data.date.end).endOf("day").toDate()
                            }
                        },
                    ]

                },

            },
            {
                $group: {
                    _id: null, cgst: { $sum: '$cgstCharges' }, sgst: { $sum: '$sgstCharges' }, billingAmount: { $sum: "$grandTotal" }, otherCharges: { $sum: "$otherCharges" },

                    // cashAmount: {
                    //     $sum: { $cond: [{ "$eq": ["$paymentType", "Cash"] }, "$grandTotal", 0] }
                    // }, cardAmount: {
                    //     $sum: { $cond: [{ "$eq": ["$paymentType", "Card"] }, "$grandTotal", 0] }
                    // }, otherAmount: {
                    //     $sum: { $cond: [{ "$eq": ["$paymentType", "Other"] }, "$grandTotal", 0] }
                    // },
                }
            },
            {
                $addFields: {
                    totalTax: { $add: ["$cgst", "$sgst"] },
                },
            },

        ])
        // response[0].cashAmount = getToFix(response[0].cashAmount)
        response[0].billingAmount = getToFix(response[0].billingAmount)
        // response[0].cardAmount = getToFix(response[0].cardAmount)
        // response[0].otherAmount = getToFix(response[0].otherAmount)
        // response[0].totalDiscount = getToFix(response[0].totalDiscount)
        response[0].otherCharges = getToFix(response[0].otherCharges)
        response[0].cgst = getToFix(response[0].cgst)
        response[0].sgst = getToFix(response[0].sgst)
        const expenseSale = await db.Expense.aggregate([
            {
                $match: {
                    ...(branchId && { branchId: branchId }),
                    $and: [
                        {
                            "createdAt":
                            {
                                $gte: moment(data.date.start).startOf("day").toDate(),
                                $lte: moment(data.date.end).endOf("day").toDate()
                            }
                        },
                    ]

                },

            },
            {
                $group: {
                    _id: null, totalExpense: { $sum: "$expensePrice" },
                },
            }

        ])
        const order = await db.Order.find({
            "createdAt": {
                $gte: new Date(startDate).setHours(0, 0, 0, 0),
                $lte: new Date(endDate).setHours(23, 59, 59, 999),
            },
            ...(branchId && { branchId: branchId })
        })
        const responseData = { ...(response[0] && response[0]), totalOrders: order.length, totalExpense: expenseSale.length > 0 ? getToFix(expenseSale[0].totalExpense) : 0 }
        return ({ status: httpStatus.OK, data: { iconsgrid: responseData } })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}


module.exports = {
    getOrderReport
}