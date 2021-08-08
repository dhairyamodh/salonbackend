const catchAsync = require('../../../utils/catchAsync');
const { salonUserService } = require('../../../services/backEnd/salon');
const { statusCheck } = require('../../../commonFunction/functionList')

const all = catchAsync(async (req, res) => {
    const response = await salonUserService.all(req.query.salonId, req.query.branchId, req.salonUserId, statusCheck(req.query.status));
    res.status(response.status).send(response);
});

const create = catchAsync(async (req, res) => {
    const response = await salonUserService.create(req.salondb, req.body);
    res.status(response.status).send(response);
});

const update = catchAsync(async (req, res) => {
    const response = await salonUserService.update(req.body);
    res.status(response.status).send(response);
});

const remove = catchAsync(async (req, res) => {
    const response = await salonUserService.remove(req.body);
    res.status(response.status).send(response);
});

module.exports = {
    all, create, update, remove
};
