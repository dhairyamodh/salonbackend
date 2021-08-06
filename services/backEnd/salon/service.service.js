const httpStatus = require('http-status');
const { getToFix } = require('../../../commonFunction/functionList');
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
                let category = singleitem.branchId != undefined ? await db.BranchCategory.findById(singleitem.categoryId) : await db.SalonCategory.findById(singleitem.categoryId)
                return { ...singleitem._doc, categoryName: category && category.categoryName, id: singleitem._doc._id }
            } else {
                return { ...singleitem._doc, categoryName: singleitem._doc.categoryName ? singleitem._doc.categoryName : '-', id: singleitem._doc._id }
            }
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
                data.imageSrc = file.destination + '/' + file.filename
            })
        } else {
            data.imageSrc = "uploaded/restaurants/service/res_logo.png";
        }
        const salePrice = parseFloat(data.salePrice)
        const price = parseFloat(data.price)
        if (price < salePrice) {
            return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Price must be a greater than sale price" })
        }
        const discount = 100 * (price - salePrice) / price;
        data.discount = discount.toFixed(0)
        data.salePrice = getToFix(data.salePrice)
        data.price = getToFix(data.price)
        if (isSalonAdmin(data.role) ? await db.SalonService.findOne({ name: data.name }) : await db.BranchService.findOne({ name: data.name })) {
            return ({ status: httpStatus.NOT_FOUND, message: "Service name must be different!" })
        }
        isSalonAdmin(data.role) ? await db.SalonService.create(data) : await db.BranchService.create(data)

        return ({ status: httpStatus.OK, message: 'Service Added Successfully' })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const update = async (db, data, files) => {
    try {
        const { error } = serviceValidation.update(data)
        if (error) {
            return ({ status: httpStatus.NOT_FOUND, message: error.details[0].message })
        }
        if (files.length > 0) {
            files.map(file => {
                data.imageSrc = file.destination + '/' + file.filename
            })
        } else {
            delete data.imageSrc
        }
        data.salePrice = parseFloat(data.salePrice).toFixed(2)
        data.price = parseFloat(data.price).toFixed(2)
        if (data.price > data.salePrice) {
            return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Price must be a greater than sale price" })
        }
        const discount = 100 * (data.price - data.salePrice) / data.price;
        data.discount = discount.toFixed(0)
        if (isSalonAdmin(data.role)) {
            await db.SalonService.findByIdAndUpdate(data.id, { ...data, categoryId: data.categoryId != 'null' ? data.categoryId : undefined })
        } else {
            if (data.categoryId) {
                console.log('if')
                await db.BranchService.update({ _id: data.id }, {
                    ...data
                })
            }
            else {
                // console.log('else', branchdata.categoryId)

                delete data.categoryId
                delete data.categoryName

                await db.BranchService.update({ _id: data.id }, {
                    ...data, $unset: { categoryId: 1, categoryName: 1 }
                })


            }
        }
        return ({ status: httpStatus.OK, message: 'Service Updated Successfully' })
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
        return ({ status: httpStatus.OK, message: 'Service Deleted Successfully' })
    } catch (error) {
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

module.exports = {
    create, all, update, remove, importall
}