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

const create = async (data) => {
    try {

        const lastOrder = await global.salons[data.salonId].Order.find({ branchId: data.branchId }).sort({ _id: -1 }).limit(1)
        if (lastOrder.length > 0 && data.orderNumber == lastOrder[0].orderNumber) {

            data.orderNumber = lastOrder[0].orderNumber++;
            data.branchOrderNumber = data.branchCode + (data.orderNumber++)
        } else {
            data.branchOrderNumber = data.branchCode + data.orderNumber
        }
        const order = await global.salons[data.salonId].Order.create(data)
        if (order) {
            if (data.customerMobile) {
                const currentCustomer = await global.salons[data.salonId].Customer.findOne({ customerMobile: data.customerMobile })
                if (!currentCustomer) {
                    await global.salons[data.salonId].Customer.create({ ...data, totalOrders: 1, totalPrice: data.grandTotal })
                } else {
                    await global.salons[data.salonId].Customer.findByIdAndUpdate(currentCustomer._id, { ...data, $inc: { totalOrders: 1, totalPrice: data.grandTotal } })
                }
            }
            await Salon.findByIdAndUpdate(data.salonId, { $inc: { balance: order.grandTotal } })
        }
        return ({ status: httpStatus.OK, message: 'Order Added Successfully', data: { ...order._doc, createdAt: moment(order.createdAt).format(DATETIMEFORMAT), taxTotal: order.cgstCharges + order.sgstCharges } })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

module.exports = {
    create, getAvailableTime
}