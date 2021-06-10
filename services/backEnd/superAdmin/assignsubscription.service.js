const httpStatus = require('http-status');
const Salon = require('../../../models/backEnd/superAdmin/salon.model')
const Subscription = require('../../../models/backEnd/superAdmin/subscription.model')
const moment = require('moment')

const create = async (data) => {
    try {
        const salonSub = await Salon.findById(data.restaurantId)
        const subscription = await Subscription.findById(data.subscriptionId);

        if (salonSub.subscription.endDate != undefined) {
            const startDate = salonSub.subscription.endDate < new Date() ? moment() : salonSub.subscription.startDate
            await Salon.findByIdAndUpdate(data.restaurantId, { $set: { subscription: { subscriptionId: data.subscriptionId, startDate: startDate, endDate: moment(salonSub.subscription.endDate).add(parseInt(subscription.subscriptionDuration), 'months').endOf("day") } } })
        } else {
            await Salon.findByIdAndUpdate(data.restaurantId, { $set: { subscription: { subscriptionId: data.subscriptionId, startDate: moment(), endDate: moment().add(subscription.subscriptionDuration, 'months').endOf("day") } } })
        }
        return ({ status: httpStatus.OK, message: 'Subscription Added Successfully' })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const remove = async (data) => {
    try {
        await Salon.findByIdAndUpdate(data.restaurantId, { $set: { subscription: {} } })
        return ({ status: httpStatus.OK, message: 'Subscription Deleted Successfully' })
    } catch (error) {
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

module.exports = {
    create, remove
}