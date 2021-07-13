const catchAsync = require("../../../utils/catchAsync");
const { subscriptionService } = require("../../../services/backEnd/superAdmin");
const { statusCheck } = require("../../../commonFunction/functionList");

const all = catchAsync(async (req, res) => {
  const response = await subscriptionService.all(statusCheck(req.query.status));
  res.status(response.status).send(response);
});

const create = catchAsync(async (req, res) => {
  const response = await subscriptionService.create(req.body);
  res.status(response.status).send(response);
});

const update = catchAsync(async (req, res) => {
  const response = await subscriptionService.update(req.body);
  res.status(response.status).send(response);
});

const remove = catchAsync(async (req, res) => {
  const response = await subscriptionService.remove(req.body.id);
  res.status(response.status).send(response);
});

module.exports = {
  all,
  create,
  update,
  remove,
};
