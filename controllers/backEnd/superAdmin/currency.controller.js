const catchAsync = require('../../../utils/catchAsync');
const { currencyService } = require('../../../services/backEnd/superAdmin');
const { statusCheck } = require('../../../commonFunction/functionList')

const all = catchAsync(async (req, res) => {
    const response = await currencyService.all(req.query.type, statusCheck(req.query.status));
    res.status(response.status).send(response);
});

const create = catchAsync(async (req, res) => {
    const response = await currencyService.create(req.body);
    res.status(response.status).send(response);
});

const update = catchAsync(async (req, res) => {
    const response = await currencyService.update(req.body);
    res.status(response.status).send(response);
});

const remove = catchAsync(async (req, res) => {
    const response = await currencyService.remove(req.body.id);
    res.status(response.status).send(response);
});

module.exports = {
    all, create, update, remove
};
