const catchAsync = require('../../utils/catchAsync');
const { serviceService } = require('../../services/frontEnd');
const { statusCheck } = require('../../commonFunction/functionList')

const trendingServices = catchAsync(async (req, res) => {
    const response = await serviceService.trendingServices(global.salons[req.query.salonId], req.query.branchId, statusCheck(req.query.status));
    res.status(response.status).send(response);
});

const categoryServices = catchAsync(async (req, res) => {
    const response = await serviceService.categoryServices(global.salons[req.query.salonId], req.query.branchId, req.query.categoryId, statusCheck(req.query.status));
    res.status(response.status).send(response);
});

const getServiceById = catchAsync(async (req, res) => {
    const response = await serviceService.getServiceById(global.salons[req.query.salonId], req.query.branchId, req.query.id);
    res.status(response.status).send(response);
});

const searchService = catchAsync(async (req, res) => {
    const response = await serviceService.searchService(global.salons[req.query.salonId], req.query.branchId, req.query.searchTerm);
    res.status(response.status).send(response);
});


module.exports = {
    trendingServices, categoryServices, getServiceById, searchService
};
