const catchAsync = require('../../../utils/catchAsync');
const { userService } = require('../../../services/backEnd/salon');

const all = catchAsync(async (req, res) => {
    const response = await userService.all(req.query.salonId, req.branchId, req.query.start, req.query.end);
    res.status(response.status).send(response);
});


module.exports = {
    all
};
