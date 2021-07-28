const catchAsync = require('../../utils/catchAsync');
const { statusCheck } = require('../../commonFunction/functionList');
const { dealsService } = require('../../services/frontEnd');

const all = catchAsync(async (req, res) => {
    const response = await dealsService.all(req.query.salonId, statusCheck(req.query.status));
    res.status(response.status).send(response);
});

module.exports = {
    all,
};
