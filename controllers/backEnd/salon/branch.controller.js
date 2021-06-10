const catchAsync = require('../../../utils/catchAsync');
const { branchService } = require('../../../services/backEnd/salon');
const { statusCheck } = require('../../../commonFunction/objectList');


const getBranchBySalonId = catchAsync(async (req, res) => {
    const response = await branchService.getBranchBySalonId(req.query.id, statusCheck(req.query.status));
    res.status(response.status).send(response);
});

const create = catchAsync(async (req, res) => {
    const response = await branchService.create(req.body);
    res.status(response.status).send(response);
});

const update = catchAsync(async (req, res) => {
    const response = await branchService.update(req.body);
    res.status(response.status).send(response);
});

const remove = catchAsync(async (req, res) => {
    const response = await branchService.remove(req.body);
    res.status(response.status).send(response);
});

module.exports = {
    create, update, remove, getBranchBySalonId
};
