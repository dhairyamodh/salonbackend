const httpStatus = require('http-status');
const moment = require('moment')
const getFormattedDate = (date, format) => {
    return moment(date).utcOffset("+05:30").format(format);
};

const getReport = async (db, data) => {
    try {
        const branchId = data.branchId != 'all' ? ObjectId(data.branchId) : undefined
        // const expenseType = await db.RestaurantExpenseType.find()
        let totalExpenses = {}
        let iconHeaders = []
        // await Promise.all(expenseType.map(async (item) => {
        //     const expense = await db.Expense.aggregate([
        //         {
        //             $match: {
        //                 // ...(branchId && { branchId: branchId }),
        //                 // expenseTypeId: item._id,
        //                 $and: [
        //                     {
        //                         "createdAt":
        //                         {
        //                             $gte: moment(data.date.start).startOf("day").toDate(),
        //                             $lte: moment(data.date.end).endOf("day").toDate()
        //                         }
        //                     },
        //                 ]

        //             },

        //         },
        //         {
        //             $group: {
        //                 _id: null, totalExpense: { $sum: "$expensePrice" },
        //             },
        //         }

        //     ])
        //     iconHeaders.push(item.expenseType)
        //     totalExpenses[item.expenseType] = expense[0] != undefined ? expense[0].totalExpense : 0
        // }))
        const expenses = await db.Expense.aggregate([
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

        ])
        return ({ status: httpStatus.OK, data: { table: expenses } })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}


module.exports = {
    getReport
}