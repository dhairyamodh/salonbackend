const catchAsync = require("../../../utils/catchAsync");
const {
  assignSubscriptionService,
} = require("../../../services/backEnd/superAdmin");

const create = catchAsync(async (req, res) => {
  const response = await assignSubscriptionService.create(req.body);
  res.status(response.status).send(response);
});
const remove = catchAsync(async (req, res) => {
  const response = await assignSubscriptionService.remove(req.body);
  res.status(response.status).send(response);
});

module.exports = {
  create,
  remove,
};
