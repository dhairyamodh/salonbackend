const catchAsync = require('../../../utils/catchAsync');
const { statusCheck } = require('../../../commonFunction/objectList');
const { salonCategoryService } = require('../../../services/backEnd/salon');

const all = catchAsync(async (req, res) => {
    const response = await salonCategoryService.all(req.query.resId, req.query.branchId, statusCheck(req.query.status));
    res.status(response.status).send(response);
});

const create = catchAsync(async (req, res) => {
    const response = await salonCategoryService.create(req.body, req.files);
    res.status(response.status).send(response);
});

const update = catchAsync(async (req, res) => {
    const response = await salonCategoryService.update(req.body, req.files);
    res.status(response.status).send(response);
});

const remove = catchAsync(async (req, res) => {
    const response = await salonCategoryService.remove(req.body);
    res.status(response.status).send(response);
});

const importall = catchAsync(async (req, res) => {
    const response = await salonCategoryService.importall(req.body);
    res.status(response.status).send(response);
});

module.exports = {
    create, update, remove, all, importall
};
