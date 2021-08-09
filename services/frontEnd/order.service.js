const httpStatus = require('http-status');
const moment = require('moment')
moment.suppressDeprecationWarnings = true;


function returnTimesInBetween(start, end) {
    var timesInBetween = [];

    var startH = parseInt(start.split(":")[0]);
    var startM = parseInt(start.split(":")[1]);
    var endH = parseInt(end.split(":")[0]);
    var endM = parseInt(end.split(":")[1]);

    if (startM == 30)
        startH++;

    for (var i = startH; i < endH; i++) {
        timesInBetween.push(i < 10 ? "0" + i + ":00" : i + ":00");
        timesInBetween.push(i < 10 ? "0" + i + ":30" : i + ":30");

    }

    timesInBetween.push(endH + ":00");
    if (endM == 30)
        timesInBetween.push(endH + ":30")

    return timesInBetween;
}


const getAvailableArtist = async (db, branchId, date) => {
    try {
        const dayName = moment(date).format('ddd')
        const artist = await db.SalonUser.aggregate([
            {
                $match: {
                    userRole: 'employee',
                    status: true
                },

            },
            // {
            //     $lookup: {
            //         from: "salonusergroups",
            //         localField: "groupId",
            //         foreignField: "_id",
            //         as: "groups",
            //     },
            // },
            // {
            //     $unwind: { path: '$groups', preserveNullAndEmptyArrays: true }
            // },
        ])
        const newArtist = await Promise.all(
            artist.map(async (artist) => {
                if (artist.groupId) {
                    const group = await db.SalonUserGroup.findById(artist.groupId);
                    if (group)
                        return { ...artist, groups: group }
                    return artist
                }
                return artist
            })
        )
        const getAvailableArtist = newArtist.filter((ar) => {
            const day = ar.employeeSchedule.find((sc) => sc.dayName === dayName)
            if (day) {
                if (day.isWorking) {
                    return true
                }
            }
            return false
        })
        return ({ status: httpStatus.OK, data: getAvailableArtist })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const getAvailableTime = async (db, branchId, data) => {
    try {

        const artist = await db.SalonUser.findById(data._id)
        const dayName = moment(data.date).format('ddd')

        const getTime = artist.employeeSchedule.find((ar) => {
            return ar.dayName === dayName
        })
        let fromtime = getTime.startTime

        let totime = getTime.endTime
        let allArtistTime = returnTimesInBetween(fromtime, totime)


        let bookingTime = []

        const getBookingTime = await db.Order.aggregate([
            {
                $match: {
                    employeeId: ObjectId(data._id),
                    $and: [
                        {
                            "startDate":
                            {
                                $gte: moment(data.date).startOf("day").toDate(),
                                $lte: moment(data.date).endOf("day").toDate()
                            }
                        },
                    ]

                },

            },
        ])

        await getBookingTime.map((booking) => {
            bookingTime.push(booking.startTime)
        })

        // console.log('bookingTime', bookingTime, allArtistTime);
        const newArray = allArtistTime.filter(obj => !bookingTime.includes(obj));
        const currentTime = moment().format("HH:mm")
        const currentTimeArr = returnTimesInBetween('00:00', currentTime)
        const availableTime = newArray.filter(obj => !currentTimeArr.includes(obj))
        // console.log('newArray', newArray, availableTime, currentTimeArr);

        return ({ status: httpStatus.OK, data: availableTime })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const create = async (db, data) => {
    try {
        // const time = moment(data.selectedTime, ["h:mm A"]).format("HH:mm");
        const time = data.selectedTime;

        const lastOrder = await db.Order.find({
            branchId: data.branchId != undefined ? data.branchId : undefined,
        })
            .sort({ _id: -1 })
            .limit(1);

        const orderNumber = lastOrder.length > 0 ? ++lastOrder[0].orderNumber : 1;
        console.log(moment(data.selectedDate).format());
        const order = await db.Order.create({ ...data, userName: data.name, userEmail: data.email, userMobile: data.mobile, orderItems: data.cartItems, startDate: moment(data.selectedDate).format(), startTime: time, orderNumber: orderNumber })

        if (order) {
            await db.Cart.findOneAndUpdate({ customerId: data.userId }, { $set: { items: [] } })
        }
        return ({ status: httpStatus.OK, data: order })

    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const update = async (db, data) => {
    try {
        const updatedOrder = await db.Order.findByIdAndUpdate(data.id, data, { new: true });
        // const updatedOrder = await db.Order.findById(data.id);

        return { status: httpStatus.OK, message: "Order Updated Successfully", data: updatedOrder };
    } catch (error) {
        console.log(error);
        return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
    }
};

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
    create, getAvailableTime, getOrderById, update, getAvailableArtist
}