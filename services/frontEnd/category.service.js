const httpStatus = require('http-status');
const { Category } = require('../../models/backEnd/superAdmin');


const all = async (salonId, branchId, status) => {
    try {
        let category = []
        const data = {
            ...(branchId != undefined && { branchId: ObjectId(branchId) }),
            ...status
        };
        if (branchId != undefined) {
            category = await global.salons[salonId].BranchCategory.aggregate([
                { $match: data },
                {
                    $lookup: {
                        from: "BranchService",
                        localField: "_id",
                        foreignField: "branchId",
                        as: "services",
                    },
                },
                {
                    $project: {
                        categoryName: "$categoryName",
                        categoryImage: "$categoryImage",
                        totalServices: { $size: "$services" },
                    },
                },
            ])
        } else if (salonId != undefined) {
            category = await global.salons[salonId].SalonCategory.aggregate([
                { $match: data },
                {
                    $lookup: {
                        from: "salonservices",
                        localField: "_id",
                        foreignField: "categoryId",
                        as: "services",
                    },
                },
                {
                    $project: {
                        categoryName: "$categoryName",
                        categoryImage: "$categoryImage",
                        totalServices: { $size: "$services" },
                    },
                },
            ])
        } else {
            category = await Category.find(status)
        }

        return ({ status: httpStatus.OK, data: category })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}



module.exports = {
    all
}