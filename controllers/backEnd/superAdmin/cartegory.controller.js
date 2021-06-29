const catchAsync = require('../../../utils/catchAsync');
const { categoryService } = require('../../../services/backEnd/superadmin');
const { statusCheck } = require('../../../commonFunction/functionList')

const all = catchAsync(async (req, res) => {
    const response = await categoryService.all(req.query.resId, statusCheck(req.query.status));
    res.status(response.status).send(response);
});

const create = catchAsync(async (req, res) => {
    const response = await categoryService.create(req.body, req.files);
    res.status(response.status).send(response);
});

const update = catchAsync(async (req, res) => {
    const response = await categoryService.update(req.body, req.files);
    res.status(response.status).send(response);
});

const remove = catchAsync(async (req, res) => {
    const response = await categoryService.remove(req.body.id);
    res.status(response.status).send(response);
});

module.exports = {
    all, create, update, remove
};
