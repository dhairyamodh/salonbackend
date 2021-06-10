const httpStatus = require('http-status');
const CategoryType = require('../../../models/backEnd/superAdmin/category.model');
const { categoryValidation } = require('../../../validations/backEnd/superAdmin')

const isSuperadminRole = (role) => {
    return role === 'superadmin'
}

const isSalonAdminRole = (role) => {
    return role === 'salonadmin'
}

const all = async (resId, branchId, status) => {
    try {
        // const data = { ...(branchId != 'all' && { branchId: ObjectId(branchId) }) }
        const category = (branchId != undefined) ? await global.salons[resId].BranchItemCategory.find({ branchId: branchId, ...status }) : (resId != undefined) ? await global.salons[resId].SalonCategory.find(status) : await CategoryType.find(status)

        return ({ status: httpStatus.OK, data: category })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const create = async (data, files) => {
    try {
        const { error } = categoryValidation.create(data, isSuperadminRole(data.role))
        if (error) {
            console.log(error);
            return ({ status: httpStatus.NOT_FOUND, message: error.details[0].message })
        }
        const checkCategory = isSuperadminRole(data.role) ? await CategoryType.find({ categoryName: data.categoryName }) : isSalonAdminRole(data.role) ? await global.salons[data.restaurantId].ItemCategory.find({ categoryName: data.categoryName }) : await global.salons[data.restaurantId].BranchItemCategory.find({ categoryName: data.categoryName });
        if (checkCategory.length > 0) {
            return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Category already exists" })
        }
        if (files) {
            files.map(file => {
                data.categoryImage = file.destination + '/' + file.filename
            })
        } else {
            data.categoryImage = "uploaded/salons/category/res_logo.png";
        }
        isSuperadminRole(data.role) ? await CategoryType.create(data) : isSalonAdminRole(data.role) ? await global.salons[data.restaurantId].ItemCategory.create(data) : await global.salons[data.restaurantId].BranchItemCategory.create(data)
        return ({ status: httpStatus.OK, message: 'Category Added Successfully' })
    } catch (error) {
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const update = async (data, files) => {
    try {
        const { error } = categoryValidation.update(data, isSuperadminRole(data.role))
        if (error) {
            return ({ status: httpStatus.NOT_FOUND, message: error.details[0].message })
        }
        const checkCategory = isSuperadminRole(data.role) ? await CategoryType.find({ categoryName: data.categoryName }) : isSalonAdminRole(data.role) ? await global.salons[data.restaurantId].ItemCategory.find({ categoryName: data.categoryName }) : await global.salons[data.restaurantId].BranchItemCategory.find({ categoryName: data.categoryName });
        if (checkCategory.length > 0) {
            if (!checkCategory.find((cate) => {
                return cate.id == data.id
            })) {
                return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Category already exists" })
            }
        }
        if (files) {
            files.map(file => {
                data.categoryImage = file.destination + '/' + file.filename
            })
        }
        isSuperadminRole(data.role) ? await CategoryType.findByIdAndUpdate(data.id, data) : isSalonAdminRole(data.role) ? await global.salons[data.restaurantId].ItemCategory.findByIdAndUpdate(data.id, data) : await global.salons[data.restaurantId].BranchItemCategory.findByIdAndUpdate(data.id, data)
        return ({ status: httpStatus.OK, message: 'Category Updated Successfully' })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const remove = async (data) => {
    try {
        if (isSuperadminRole(data.role)) {
            await CategoryType.findByIdAndDelete(data.id)
        }
        else if (isSalonAdminRole(data.role)) {
            await global.salons[data.restaurantId].ItemCategory.findByIdAndDelete(data.id)
        } else {
            await global.salons[data.restaurantId].BranchItemCategory.findByIdAndDelete(data.id);
        }

        if (!isSuperadminRole(data.role)) {
            !isSalonAdminRole(data.role) ? await global.salons[data.restaurantId].BranchItem.updateMany({ categoryId: data.id }, { $set: { categoryId: undefined } }) : await global.salons[data.restaurantId].RestaurantItem.updateMany({ categoryId: data.id }, { $set: { categoryId: undefined } });
        }
        return ({ status: httpStatus.OK, message: 'Category Deleted Successfully' })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const importall = async (data) => {
    try {
        data.branchId ? await global.salons[data.restaurantId].BranchItemCategory.insertMany(data.data) : await global.salons[data.restaurantId].ItemCategory.insertMany(data.data)
        return ({ status: httpStatus.OK, message: 'Category Imported Successfully' })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}


module.exports = {
    create, all, update, remove, importall
}