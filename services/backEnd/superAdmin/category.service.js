const httpStatus = require('http-status');
const { Category } = require('../../../models/backEnd/superadmin');

const all = async (resId, status) => {
    try {
        const result = await Category.find(status)
        return ({ status: httpStatus.OK, data: result })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
};

const create = async (data, files) => {
    try {
        if (files) {
            files.map(file => {
                data.categoryImage = file.destination + '/' + file.filename
            })
        } else {
            data.categoryImage = "uploaded/restaurants/category/res_logo.png";
        }
        await Category.create(data)
        return ({ status: httpStatus.OK, message: 'Category Added Successfully' })
    } catch (error) {
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const update = async (data, files) => {
    try {
        if (files) {
            files.map(file => {
                data.categoryImage = file.destination + '/' + file.filename
            })
        }
        await Category.findByIdAndUpdate(data._id || data.id, data);
        return ({ status: httpStatus.OK, message: 'Category Updated Successfully' })
    } catch (error) {
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const remove = async (data) => {
    try {
        await Category.findByIdAndDelete(data);
        return ({ status: httpStatus.OK, message: 'Category Deleted Successfully' })
    } catch (error) {
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

module.exports = {
    all, create, update, remove
}