const catchAsync = require('../../utils/catchAsync');
const { orderService } = require('../../services/frontEnd');


const getAvailableTime = catchAsync(async (req, res) => {
    const response = await orderService.getAvailableTime(req.query.salonId, req.query.branchId, req.query.date);
    res.status(response.status).send(response);
});

const create = catchAsync(async (req, res) => {
    const response = await orderService.create(req.body);
    res.status(response.status).send(response);
});


module.exports = {
    create, getAvailableTime
};
