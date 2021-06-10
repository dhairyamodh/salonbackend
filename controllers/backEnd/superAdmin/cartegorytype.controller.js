const catchAsync = require('../../../utils/catchAsync');
const { categoryTypeService } = require('../../../services/backEnd/superadmin');
const { statusCheck } = require('../../../commonFunction/objectList')

const all = catchAsync(async (req, res) => {
    const response = await categoryTypeService.all(req.query.resId, statusCheck(req.query.status));
    res.status(response.status).send(response);
});

const create = catchAsync(async (req, res) => {
    const response = await categoryTypeService.create(req.body, req.files);
    res.status(response.status).send(response);
});

const update = catchAsync(async (req, res) => {
    const response = await categoryTypeService.update(req.body, req.files);
    res.status(response.status).send(response);
});

const remove = catchAsync(async (req, res) => {
    const response = await categoryTypeService.remove(req.body.id);
    res.status(response.status).send(response);
});

module.exports = {
    all, create, update, remove
};
