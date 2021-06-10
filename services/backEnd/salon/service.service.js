const httpStatus = require('http-status');
const { serviceValidation } = require('../../../validations/backEnd/superAdmin')
const isSalonAdmin = (role) => {
    return role === 'salonadmin'
}

const all = async (db, branchId, status) => {
    try {
        const data = { ...(branchId != 'all' && { branchId: ObjectId(branchId) }), ...status }
        const item = branchId != undefined ? await db.BranchService.find(data) : await db.SalonService.find(status)
        const itemdata = await Promise.all(await item.map(async (singleitem) => {

            if (singleitem.categoryId) {
                let category = singleitem.branchId != undefined ? await db.BranchServiceCategory.findOne({ restaurantCateId: singleitem.categoryId }) : await db.ItemCategory.findById(singleitem.categoryId)
                singleitem.categoryName = category ? category.categoryName : '-'
                return { ...singleitem._doc, categoryName: category ? category.categoryName : '-', id: singleitem._doc._id }
            }
            return singleitem
        }))
        return ({ status: httpStatus.OK, data: itemdata })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const create = async (db, data, files) => {
    try {
        const { error } = serviceValidation.create(data)
        if (error) {
            return ({ status: httpStatus.NOT_FOUND, message: error.details[0].message })
        }
        if (files) {
            files.map(file => {
                data.serviceImage = file.destination + '/' + file.filename
            })
        } else {
            data.serviceImage = "uploaded/restaurants/service/res_logo.png";
        }
        if (isSalonAdmin(data.role) ? await db.SalonService.findOne({ serviceName: data.serviceName }) : await db.BranchService.findOne({ serviceName: data.serviceName })) {
            return ({ status: httpStatus.NOT_FOUND, message: "Item name must be different!" })
        }
        console.log(data);
        isSalonAdmin(data.role) ? await db.SalonService.create({ ...data, servicePrice: parseInt(data.servicePrice) }) : await db.BranchService.create({ ...data, servicePrice: parseInt(data.servicePrice) })

        return ({ status: httpStatus.OK, message: 'Item Added Successfully' })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const update = async (db, data, files) => {
    try {
        const { error } = serviceValidation.update(data)
        console.log(error);
        if (error) {
            return ({ status: httpStatus.NOT_FOUND, message: error.details[0].message })
        }
        if (data.hotKey != "") {
            const checkHotkey = (isSalonAdmin(data.role) && data.hotKey != "") ? await db.SalonService.findOne({ hotKey: data.hotKey }) : await db.BranchService.findOne({ hotKey: data.hotKey })
            if (checkHotkey) {
                const checkHotkeyItem = isSalonAdmin(data.role) ? await db.SalonService.find({ hotKey: data.hotKey, _id: data.id || data._id }) : await db.BranchService.find({ hotKey: data.hotKey, _id: data.id || data._id })
                if (checkHotkeyItem.length <= 0) {
                    return ({ status: httpStatus.NOT_FOUND, message: "Hotkey number already exist!" })
                }
            }
        }
        if (files) {
            files.map(file => {
                data.itemImage = file.destination + '/' + file.filename
            })
        }
        isSalonAdmin(data.role) ? await db.SalonService.findByIdAndUpdate(data.id, { ...data, categoryId: data.categoryId != 'common' ? data.categoryId : undefined, itemPrice: parseInt(data.itemPrice) }) : await db.BranchService.findByIdAndUpdate(data.id, { ...data, itemPrice: parseInt(data.itemPrice) })
        return ({ status: httpStatus.OK, message: 'Item Updated Successfully' })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const importall = async (db, data) => {
    try {
        await Promise.all(data.data.map(async (item, index) => {
            if (item.categoryId) {
                const checkCategory = await db.BranchServiceCategory.find({ categoryName: item.categoryName, branchId: item.branchId })
                // console.log(item.itemName, item.branchId, item.categoryName, checkCategory);
                if (checkCategory.length <= 0) {
                    const getResCategory = await db.ItemCategory.findById(item.categoryId)
                    const insertCategory = await db.BranchServiceCategory.create({ ...getResCategory._doc, branchId: item.branchId, restaurantId: item.restaurantId })
                }
            }
        }))
        await db.BranchService.insertMany(data.data)
        return ({ status: httpStatus.OK, message: 'Category Imported Successfully' })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const remove = async (db, data) => {
    try {
        !isSalonAdmin(data.role) ? await db.BranchService.findByIdAndDelete(data._id || data.id) : await db.SalonService.findByIdAndDelete(data._id || data.id)
        return ({ status: httpStatus.OK, message: 'Item Deleted Successfully' })
    } catch (error) {
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

module.exports = {
    create, all, update, remove, importall
}