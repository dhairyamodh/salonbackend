const httpStatus = require('http-status');
const Theme = require('../../../models/backEnd/superAdmin/theme.model');
const all = async (status) => {
    try {
        const themes = await Theme.find(status);
        return ({ status: httpStatus.OK, data: themes })
    } catch (error) {
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const create = async (data) => {
    try {
        await Theme.create(data)
        return ({ status: httpStatus.OK, message: 'Theme Added Successfully' })
    } catch (error) {
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const update = async (data) => {
    try {
        await Theme.findByIdAndUpdate(data.id, data)
        return ({ status: httpStatus.OK, message: 'Theme Updated Successfully' })
    } catch (error) {
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const remove = async (data) => {
    try {
        await Theme.findByIdAndDelete(data);
        return ({ status: httpStatus.OK, message: 'Theme Deleted Successfully' })
    } catch (error) {
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

module.exports = {
    all, create, update, remove
}