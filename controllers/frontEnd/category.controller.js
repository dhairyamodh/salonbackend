const catchAsync = require('../../utils/catchAsync');
const { statusCheck } = require('../../commonFunction/functionList');
const { categoryService } = require('../../services/frontEnd');

const all = catchAsync(async (req, res) => {
    const response = await categoryService.all(req.query.salonId, req.query.branchId, statusCheck(req.query.status));
    res.status(response.status).send(response);
});


module.exports = {
    all,
};
