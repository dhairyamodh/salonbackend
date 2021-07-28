const catchAsync = require('../../../utils/catchAsync');
const { statusCheck } = require('../../../commonFunction/functionList');
const { dealsService } = require('../../../services/backEnd/salon');

const all = catchAsync(async (req, res) => {
    const response = await dealsService.all(req.query.salonId, req.query.branchId, statusCheck(req.query.status));
    res.status(response.status).send(response);
});

const create = catchAsync(async (req, res) => {
    const response = await dealsService.create(req.body);
    res.status(response.status).send(response);
});

const update = catchAsync(async (req, res) => {
    const response = await dealsService.update(req.body);
    res.status(response.status).send(response);
});

const remove = catchAsync(async (req, res) => {
    const response = await dealsService.remove(req.body);
    res.status(response.status).send(response);
});

const importall = catchAsync(async (req, res) => {
    const response = await dealsService.importall(req.body);
    res.status(response.status).send(response);
});

module.exports = {
    create, update, remove, all, importall
};
