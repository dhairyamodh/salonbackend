const catchAsync = require('../../../utils/catchAsync');
const { orderService } = require('../../../services/backEnd/salon');

const all = catchAsync(async (req, res) => {
    const response = await orderService.all(req.query.salonId, req.branchId, req.query.start, req.query.end);
    res.status(response.status).send(response);
});

const getFilterBookings = catchAsync(async (req, res) => {
    const response = await orderService.getFilterBookings(req.body.salonId, req.salonUserId, req.body);
    res.status(response.status).send(response);
});

const create = catchAsync(async (req, res) => {
    const response = await orderService.create(req.body);
    res.status(response.status).send(response);
});

const update = catchAsync(async (req, res) => {
    const response = await orderService.update(req.body);
    res.status(response.status).send(response);
});

const remove = catchAsync(async (req, res) => {
    const response = await orderService.remove(req.body);
    res.status(response.status).send(response);
});

module.exports = {
    create, update, remove, all, getFilterBookings
};
