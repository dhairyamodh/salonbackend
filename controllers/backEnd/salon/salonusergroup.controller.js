const catchAsync = require('../../../utils/catchAsync');
const { salonUserGroupService } = require('../../../services/backEnd/salon');

const all = catchAsync(async (req, res) => {
    const response = await salonUserGroupService.all(req.query.salonId, req.query.branchId);
    res.status(response.status).send(response);
});

const create = catchAsync(async (req, res) => {
    const response = await salonUserGroupService.create(req.body);
    res.status(response.status).send(response);
});

const update = catchAsync(async (req, res) => {
    const response = await salonUserGroupService.update(req.body);
    res.status(response.status).send(response);
});

const remove = catchAsync(async (req, res) => {
    const response = await salonUserGroupService.remove(req.body);
    res.status(response.status).send(response);
});

module.exports = {
    all, create, update, remove
};
