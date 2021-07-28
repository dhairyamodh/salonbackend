const httpStatus = require('http-status');
const { Salon } = require('../../models/backEnd/superAdmin');
const { DATETIMEFORMAT } = require('../../commonFunction/objectList')
const moment = require('moment')
moment.suppressDeprecationWarnings = true;


const getAvailableTime = async (salonId, branchId, date) => {
    try {
        const startDate = date.split("T")[0]
        console.log('startDate', new Date(startDate).setHours(0, 0, 0, 0));
        // const data = (branchId != undefined && { branchId: ObjectId(branchId) })
        // const orders = await global.salons[salonId].Order.find({
        //     "startDate": {
        //         $gte: new Date(startDate).setHours(10, 0, 0, 0),
        //     },
        //     ...data
        // })
        // console.log('orders', orders);
        return ({ status: httpStatus.OK })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const create = async (db, data) => {
    try {
        const time = moment(data.selectedTime, ["h:mm A"]).format("HH:mm");
        const lastOrder = await db.Order.find({
            branchId: data.branchId != undefined ? data.branchId : undefined,
        })
            .sort({ _id: -1 })
            .limit(1);

        const orderNumber = lastOrder.length > 0 ? ++lastOrder[0].orderNumber : 1;
        const order = await db.Order.create({ ...data, userName: data.name, userEmail: data.email, userMobile: data.mobile, orderItems: data.cartItems, startDate: data.selectedDate, startTime: time, orderNumber: orderNumber })

        if (order) {
            await db.Cart.findOneAndUpdate({ customerId: data.userId }, { $set: { items: [] } })
        }
        return ({ status: httpStatus.OK, data: order })

    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const getOrderById = async (db, data) => {
    try {
        const order = await db.Order.findById(data)
        return ({ status: httpStatus.OK, data: order })

    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

module.exports = {
    create, getAvailableTime, getOrderById
}