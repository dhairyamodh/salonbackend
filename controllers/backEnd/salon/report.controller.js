const catchAsync = require('../../../utils/catchAsync');
const { reportService } = require('../../../services/backEnd/salon');


const all = catchAsync(async (req, res) => {
    const response = await reportService.all(global.salons[req.body.salonId], req.body);
    res.status(response.status).send(response);
});

module.exports = {
    all
};
