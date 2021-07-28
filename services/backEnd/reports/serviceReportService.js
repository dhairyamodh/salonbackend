const httpStatus = require('http-status');
const moment = require('moment')
const getFormattedDate = (date, format) => {
    return moment(date).utcOffset("+05:30").format(format);
};

const getReport = async (db, data) => {
    try {
        let startDate = getFormattedDate(data.date.start);
        let endDate = getFormattedDate(data.date.end);
        const branchId = data.branchId != 'all' ? ObjectId(data.branchId) : undefined
        const orders = await db.Order.find({
            "createdAt": {
                $gte: new Date(startDate).setHours(0, 0, 0, 0),
                $lte: new Date(endDate).setHours(23, 59, 59, 999),
            },
            // ...(branchId && { branchId: branchId })
        })
        let items = [];
        orders.map((order) => {
            let currentItems = order.orderItems
            currentItems.forEach((currItem) => {
                let itemindex = items.findIndex(
                    (indexItem) => indexItem.id === currItem.id
                );
                if (itemindex === -1) {
                    let pushItem = currItem;
                    let itemTotalSold = currItem.itemsTotal;
                    pushItem.totalSold = itemTotalSold;
                    items.push(pushItem);
                } else {
                    let totalSold = items[itemindex].totalSold
                        ? items[itemindex].totalSold
                        : 0;

                    // let currentQuantity = items[itemindex].quantity;
                    let currTotalSold = items[itemindex].totalSold + currItem.itemsTotal

                    items[itemindex] = {
                        ...items[itemindex],

                        // quantity: items[itemindex].quantity + currItem.quantity,

                        totalSold: currTotalSold,
                    };
                }
                //
            });
        })
        console.log(items);
        return ({ status: httpStatus.OK, data: { table: items } })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}


module.exports = {
    getReport
}