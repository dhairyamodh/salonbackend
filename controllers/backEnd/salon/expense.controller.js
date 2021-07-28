const catchAsync = require("../../../utils/catchAsync");
const { expenseService } = require("../../../services/backEnd/salon");
const { statusCheck } = require("../../../commonFunction/functionList");

const all = catchAsync(async (req, res) => {
  const response = await expenseService.all(
    req.query.salonId, req.branchId, req.query.start, req.query.end,
  );
  res.status(response.status).send(response);
});

const create = catchAsync(async (req, res) => {
  const response = await expenseService.create(req.body);
  res.status(response.status).send(response);
});

const update = catchAsync(async (req, res) => {
  const response = await expenseService.update(req.body);
  res.status(response.status).send(response);
});

const remove = catchAsync(async (req, res) => {
  const response = await expenseService.remove(req.body);
  res.status(response.status).send(response);
});

module.exports = {
  all,
  create,
  update,
  remove,
};
