const httpStatus = require('http-status');


const categoryServices = async (db, branchId, categoryId, status, fetchLimit, pageNumber) => {
    try {
        const page = parseInt(pageNumber || 1);
        const limit = parseInt(fetchLimit);
        const skipIndex = page * limit;

        const data = { ...(branchId != undefined && { branchId: ObjectId(branchId) }), ...(categoryId != undefined && { categoryId: ObjectId(categoryId) }), ...status }
        const totalServices = branchId != undefined ? await db.BranchService.find(data).count() : await db.SalonService.find(data).count()
        const services = branchId != undefined ? await db.BranchService.find(data).limit(skipIndex) : await db.SalonService.find(data).limit(skipIndex)
        const servicedata = await Promise.all(await services.map(async (singleitem) => {
            if (singleitem.categoryId) {
                let category = singleitem.branchId != undefined ? await db.BranchCategory.findById(singleitem.categoryId) : await db.SalonCategory.findById(singleitem.categoryId)
                return { ...singleitem._doc, categoryName: category && category.categoryName, id: singleitem._doc._id }
            } else {
                return { ...singleitem._doc, categoryName: singleitem._doc.categoryName ? singleitem._doc.categoryName : undefined, id: singleitem._doc._id }
            }
        }))
        return ({ status: httpStatus.OK, data: servicedata, totalServices: totalServices })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const getServiceById = async (db, branchId, id) => {
    try {

        const services = branchId != undefined ? await db.BranchService.findById(id) : await db.SalonService.findById(id)
        let categoryName = ''
        if (services.categoryId) {
            let category = services.branchId != undefined ? await db.BranchCategory.findById(services.categoryId) : await db.SalonCategory.findById(services.categoryId)
            categoryName = category && category.categoryName
        } else {
            categoryName = categoryName ? categoryName : undefined
        }
        return ({ status: httpStatus.OK, data: { ...services._doc, categoryName: categoryName }, })

    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}


module.exports = {
    categoryServices, getServiceById
}