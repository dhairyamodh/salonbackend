const catchAsync = require('../../../utils/catchAsync');
const { customerService } = require('../../../services/backEnd/salon');

const all = catchAsync(async (req, res) => {
    const response = await customerService.all(req.query.salonId, req.branchId, req.query.start, req.query.end);
    res.status(response.status).send(response);
});


module.exports = {
    all
};
