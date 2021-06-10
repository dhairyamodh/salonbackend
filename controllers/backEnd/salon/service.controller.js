const catchAsync = require('../../../utils/catchAsync');
const { serviceService } = require('../../../services/backEnd/salon');
const { statusCheck } = require('../../../commonFunction/objectList')


const all = catchAsync(async (req, res) => {
    const response = await serviceService.all(global.salons[req.salondb], req.query.branchId, statusCheck(req.query.status));
    res.status(response.status).send(response);
});

const create = catchAsync(async (req, res) => {
    const response = await serviceService.create(global.salons[req.salondb], req.body, req.files);
    res.status(response.status).send(response);
});

const update = catchAsync(async (req, res) => {
    const response = await serviceService.update(global.salons[req.salondb], req.body, req.files);
    res.status(response.status).send(response);
});

const importall = catchAsync(async (req, res) => {
    const response = await serviceService.importall(global.salons[req.salondb], req.body);
    res.status(response.status).send(response);
});

const remove = catchAsync(async (req, res) => {
    const response = await serviceService.remove(global.salons[req.salondb], req.body);
    res.status(response.status).send(response);
});

module.exports = {
    create, update, remove, all, importall
};
