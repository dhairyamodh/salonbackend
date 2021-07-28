const catchAsync = require('../../../utils/catchAsync');
const { statusCheck } = require('../../../commonFunction/functionList');
const { offersService } = require('../../../services/backEnd/salon');

const all = catchAsync(async (req, res) => {
    const response = await offersService.all(req.query.salonId, req.query.branchId, statusCheck(req.query.status));
    res.status(response.status).send(response);
});

const create = catchAsync(async (req, res) => {
    const response = await offersService.create(req.body, req.files);
    res.status(response.status).send(response);
});

const update = catchAsync(async (req, res) => {
    const response = await offersService.update(req.body, req.files);
    res.status(response.status).send(response);
});

const remove = catchAsync(async (req, res) => {
    const response = await offersService.remove(req.body);
    res.status(response.status).send(response);
});

const importall = catchAsync(async (req, res) => {
    const response = await offersService.importall(req.body);
    res.status(response.status).send(response);
});

module.exports = {
    create, update, remove, all, importall
};
