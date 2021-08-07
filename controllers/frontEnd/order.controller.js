const catchAsync = require('../../utils/catchAsync');
const { orderService } = require('../../services/frontEnd');


const getAvailableArtist = catchAsync(async (req, res) => {
    const response = await orderService.getAvailableArtist(global.salons[req.query.salonId], req.query.branchId, req.query.date);
    res.status(response.status).send(response);
});

const getAvailableTime = catchAsync(async (req, res) => {
    const response = await orderService.getAvailableTime(global.salons[req.body.salonId], req.body.branchId, req.body);
    res.status(response.status).send(response);
});

const create = catchAsync(async (req, res) => {
    const response = await orderService.create(global.salons[req.body.salonId], req.body);
    res.status(response.status).send(response);
});

const update = catchAsync(async (req, res) => {
    const response = await orderService.update(global.salons[req.body.salonId], req.body);
    res.status(response.status).send(response);
});

const getOrderById = catchAsync(async (req, res) => {
    const response = await orderService.getOrderById(global.salons[req.query.salonId], req.query.data);
    res.status(response.status).send(response);
});


module.exports = {
    create, getAvailableTime, getOrderById, update, getAvailableArtist
};
