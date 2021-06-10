const httpStatus = require('http-status');
const bcrypt = require("bcryptjs");
const User = require('../../../models/user.model');
const Salon = require('../../../models/backEnd/superAdmin/Salon.model');
const all = async (salonId, branchId, status) => {
    try {
        const data = { ...(salonId != 'all' && { salonId: ObjectId(salonId) }), ...(branchId != 'all' && { branchId: ObjectId(branchId) }), ...status }
        let users = [];
        if (salonId == 'all') {
            await Promise.all(Object.values(global.salons).map(async (key, index) => {
                const allusers = await key.SalonUser.aggregate([
                    {
                        $project: {
                            branchUser: '$$ROOT',
                            userName: "$userName",
                            userRole: "$userRole",
                            salonId: '$salonId',
                            branchId: '$branchId',
                            userMobile: "$userMobile",
                            status: "$status",
                        }
                    }
                ]);
                users.push(...allusers)
            }))
        } else {

            users = await global.salons[salonId].SalonUser.aggregate([{
                $match: data
            },
            {
                $project: {
                    branchUser: '$$ROOT',
                    userName: "$userName",
                    userRole: "$userRole",
                    salonId: '$salonId',
                    branchId: '$branchId',
                    userMobile: "$userMobile",
                    status: "$status",
                }
            }
            ]);
        }
        const userdata = await Promise.all(users.map(async (item) => {
            if (item.salonId && global.salons[item.salonId]) {
                let salon = await Salon.findById(item.salonId);
                if (item.branchId) {
                    let branch = await global.salons[item.salonId].Branch.findById(item.branchId)
                    item.branchName = branch ? branch.branchName : undefined;
                    item.associatedWith = `${salon.name} (${branch.branchName})`
                } else {
                    item.associatedWith = salon.name
                }

            }
            return { ...item }
        }))

        return ({ status: httpStatus.OK, data: userdata })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const create = async (salonId, data) => {
    try {
        const checkMobile = await User.find({ mobile: data.userMobile })
        if (checkMobile.length > 0) {
            return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Mobile number already exist!, Please try another mobile number" })
        }
        const restaurantUser = await global.salons[data.salonId].SalonUser.create({ ...data, userRole: data.role })
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(data.password, salt);
        await User.create({ name: data.userName, mobile: data.userMobile, password: hashPassword, role: data.role, restaurantUserId: restaurantUser._id, salonId: data.salonId, branchId: data.branchId ? data.branchId : undefined })

        return ({ status: httpStatus.OK, message: 'User Added Successfully' })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const update = async (data) => {
    try {
        const checkMobile = await User.find({ mobile: data.userMobile })
        if (checkMobile.length > 0) {
            const checkuser = await User.find({ mobile: data.userMobile, restaurantUserId: data._id })

            if (checkuser.length <= 0) {
                return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Mobile number already exist!, Please try another mobile number" })
            }
        }

        await global.salons[data.salonId].SalonUser.findByIdAndUpdate(data._id, data)
        await User.findOneAndUpdate({ restaurantUserId: data._id }, { name: data.userName, mobile: data.userMobile })
        return ({ status: httpStatus.OK, message: 'User Updated Successfully' })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const remove = async (data) => {
    try {
        await global.salons[data.salonId].SalonUser.findByIdAndDelete(data._id)
        await global.salons[data.salonId].SalonUser.findOneAndDelete({ restaurantUserId: data._id })
        await User.findOneAndDelete({ restaurantUserId: data._id });
        return ({ status: httpStatus.OK, message: 'User Deleted Successfully' })
    } catch (error) {
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const removeAll = async (data) => {
    try {
        await User.deleteMany(data)
        await global.salons[data.salonId].SalonUser.deleteMany(data)
        return ({ status: httpStatus.OK, message: 'User Deleted Successfully' })
    } catch (error) {
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

module.exports = {
    all, create, update, remove, removeAll
}