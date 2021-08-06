const httpStatus = require('http-status');
const { getToFix } = require('../../commonFunction/functionList');

const trendingServices = async (db, branchId, status) => {
    try {
        const data = { ...(branchId != undefined && { branchId: ObjectId(branchId) }), ...status }
        const sellingorders = await db.Order.find(data)
        let services = [];
        if (sellingorders.length >= 5) {
            sellingorders.map(async (order) => {
                let currentServices = order.orderItems;
                currentServices.forEach(async (currItem) => {
                    let serviceindex = services.findIndex(
                        (indexItem) => indexItem.id === currItem.id
                    );
                    if (serviceindex === -1) {
                        let pushItem = currItem;
                        let itemTotalSold = currItem.itemTotal;
                        pushItem.totalSold = itemTotalSold;
                        services.push(pushItem);
                    } else {
                        let totalSold = services[serviceindex].totalSold
                            ? services[serviceindex].totalSold
                            : 0;

                        let currTotalSold = services[serviceindex].totalSold + currItem.itemTotal;

                        services[serviceindex] = {
                            ...services[serviceindex],
                            quantity: services[serviceindex].quantity + currItem.quantity,
                            totalSold: currTotalSold,
                        };
                    }
                    //
                });
            });
        } else {
            const allservices = branchId != undefined ? await db.BranchService.find(data).limit(10) : await db.SalonService.find(data).limit(10)
            services = await Promise.all(await allservices.map(async (singleitem) => {
                if (singleitem.categoryId) {
                    let category = singleitem.branchId != undefined ? await db.BranchCategory.findById(singleitem.categoryId) : await db.SalonCategory.findById(singleitem.categoryId)
                    return { ...singleitem._doc, salePrice: getToFix(singleitem._doc.salePrice), price: getToFix(singleitem._doc.price), categoryName: category && category.categoryName, id: singleitem._doc._id }
                } else {
                    return { ...singleitem._doc, salePrice: getToFix(singleitem._doc.salePrice), price: getToFix(singleitem._doc.price), categoryName: singleitem._doc.categoryName ? singleitem._doc.categoryName : undefined, id: singleitem._doc._id }
                }
            }))
        }
        return ({ status: httpStatus.OK, data: services, })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const categoryServices = async (db, branchId, categoryId, status) => {
    try {

        const data = { ...(branchId != undefined && { branchId: ObjectId(branchId) }), ...(categoryId != 'all' && { categoryId: ObjectId(categoryId) }), ...status }
        const services = branchId != undefined ? await db.BranchService.find(data) : await db.SalonService.find(data)
        const servicedata = await Promise.all(await services.map(async (singleitem) => {
            if (singleitem.categoryId) {
                let category = singleitem.branchId != undefined ? await db.BranchCategory.findById(singleitem.categoryId) : await db.SalonCategory.findById(singleitem.categoryId)
                return { ...singleitem._doc, salePrice: getToFix(singleitem._doc.salePrice), price: getToFix(singleitem._doc.price), categoryName: category && category.categoryName, id: singleitem._doc._id }
            } else {
                return { ...singleitem._doc, salePrice: getToFix(singleitem._doc.salePrice), price: getToFix(singleitem._doc.price), categoryName: singleitem._doc.categoryName ? singleitem._doc.categoryName : undefined, id: singleitem._doc._id }
            }
        }))
        return ({ status: httpStatus.OK, data: servicedata, })
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
        return ({ status: httpStatus.OK, data: { ...services._doc, categoryName: categoryName, salePrice: getToFix(services.salePrice), price: getToFix(services.price), }, })

    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const searchService = async (db, branchId, data) => {
    try {

        const services = branchId ? await db.BranchService.find({ name: { $regex: '.*' + data + '.*', $options: 'i' } }) : await db.SalonService.find({ name: { $regex: data, $options: 'i' } })
        return ({ status: httpStatus.OK, data: services })

    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}


module.exports = {
    trendingServices, categoryServices, getServiceById, searchService
}