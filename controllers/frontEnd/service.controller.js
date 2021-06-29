const catchAsync = require('../../utils/catchAsync');
const { serviceService } = require('../../services/frontEnd');
const { statusCheck } = require('../../commonFunction/functionList')


const categoryServices = catchAsync(async (req, res) => {
    const response = await serviceService.categoryServices(global.salons[req.query.salonId], req.query.branchId, req.query.categoryId, statusCheck(req.query.status), req.query.fetchLimit, req.query.page,);
    res.status(response.status).send(response);
});

const getServiceById = catchAsync(async (req, res) => {
    const response = await serviceService.getServiceById(global.salons[req.query.salonId], req.query.branchId, req.query.id);
    res.status(response.status).send(response);
});


module.exports = {
    categoryServices, getServiceById
};
