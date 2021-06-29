const catchAsync = require("../../utils/catchAsync");
const { salonService } = require("../../services/frontEnd");
const { statusCheck } = require("../../commonFunction/functionList");


const getSalonById = catchAsync(async (req, res) => {
  const response = await salonService.getSalonById(req.query.salonId, req.query.branchId, statusCheck(true));
  res.status(response.status).send(response);
});

module.exports = {
  getSalonById,
};
