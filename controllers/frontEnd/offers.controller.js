const catchAsync = require('../../utils/catchAsync');
const { statusCheck } = require('../../commonFunction/functionList');
const { offersService } = require('../../services/backEnd/salon');

const all = catchAsync(async (req, res) => {
    const response = await offersService.all(req.query.salonId, req.query.branchId, statusCheck(req.query.status));
    res.status(response.status).send(response);
});

module.exports = {
    all
};
