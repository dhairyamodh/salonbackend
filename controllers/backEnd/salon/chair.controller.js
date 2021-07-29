const catchAsync = require('../../../utils/catchAsync');
const { chairService } = require('../../../services/backEnd/salon');
const { statusCheck } = require('../../../commonFunction/functionList')

const all = catchAsync(async (req, res) => {
    const response = await chairService.all(global.salons[req.query.salonId], req.query.branchId, statusCheck(req.query.status));
    res.status(response.status).send(response);
});

const create = catchAsync(async (req, res) => {
    const response = await chairService.create(global.salons[req.body.salonId], req.body);
    res.status(response.status).send(response);
});

const update = catchAsync(async (req, res) => {
    const response = await chairService.update(global.salons[req.body.salonId], req.body);
    res.status(response.status).send(response);
});

const remove = catchAsync(async (req, res) => {
    const response = await chairService.remove(global.salons[req.body.salonId], req.body);
    res.status(response.status).send(response);
});

module.exports = {
    create, update, remove, all
};
