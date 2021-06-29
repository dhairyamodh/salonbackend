const httpStatus = require('http-status');
const { Category } = require('../../models/backEnd/superAdmin');


const all = async (salonId, branchId, status) => {
    try {
        const category = (branchId != undefined) ? await global.salons[salonId].BranchCategory.find({ branchId: branchId, ...status }) : (salonId != undefined) ? await global.salons[salonId].SalonCategory.find(status) : await Category.find(status)

        return ({ status: httpStatus.OK, data: category })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}



module.exports = {
    all
}