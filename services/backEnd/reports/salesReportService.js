const httpStatus = require('http-status');
const moment = require('moment')
const getFormattedDate = (date, format) => {
    return moment(date).utcOffset("+05:30").format(format);
};

const { getToFix } = require('../../../commonFunction/functionList')

const getReport = async (db, data) => {
    try {
        const branchId = data.branchId != 'all' ? ObjectId(data.branchId) : undefined
        // console.log(moment().startOf("month").format('DD/MM/YYYY HH:mm'), moment().endOf("month").format('DD/MM/YYYY HH:mm'));
        const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        const orderdata = await Promise.all(months.map(async (month) => {
            const start = moment().startOf("year").add(month - 1, 'month').startOf('month').toDate();
            const end = moment().startOf("year").add(month - 1, 'month').endOf('month').toDate();
            const orderSale = await db.Order.aggregate([
                {
                    $match: {
                        ...(branchId && { branchId: branchId }),
                        $and: [
                            {
                                "createdAt":
                                {
                                    $gte: start,
                                    $lte: end
                                }
                            },
                        ]

                    },

                },
                {
                    $group: {
                        _id: null, all: {
                            $sum: "$grandTotal"
                        },
                    },
                }

            ])
            const expenseSale = await db.Expense.aggregate([
                {
                    $match: {
                        ...(branchId && { branchId: branchId }),
                        $and: [
                            {
                                "createdAt":
                                {
                                    $gte: start,
                                    $lte: end
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
            const thisOrderSale = orderSale.length > 0 ? getToFix(orderSale[0].all) : 0
            const thisExpenseSale = expenseSale.length > 0 ? getToFix(expenseSale[0].totalExpense) : 0
            return { orderSale: thisOrderSale, expenseSale: thisExpenseSale, profit: thisOrderSale - thisExpenseSale }
        }))
        const revenue = orderdata.map((rev) => {
            return rev.orderSale
        })
        const expense = orderdata.map((epx) => {
            return epx.expenseSale
        })
        const profit = orderdata.map((rev) => {
            return getToFix(rev.profit)
        })
        return ({ status: httpStatus.OK, data: { chart: { revenue: revenue, expense: expense, profit: profit } } })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}


module.exports = {
    getReport
}