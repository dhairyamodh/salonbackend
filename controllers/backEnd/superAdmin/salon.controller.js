const catchAsync = require("../../../utils/catchAsync");
const { salonService } = require("../../../services/backEnd/superAdmin");
const { setrestaurantdb } = require("../../../config/setrestaurantdb");
const { statusCheck } = require("../../../commonFunction/functionList");

const all = catchAsync(async (req, res) => {
  const response = await salonService.all(statusCheck(req.query.status));
  res.status(response.status).send(response);
});

const getSalonById = catchAsync(async (req, res) => {
  const response = await salonService.getSalonById(req.query.salonId, req.query.branchId, statusCheck(true));
  res.status(response.status).send(response);
});

const create = catchAsync(async (req, res, next) => {
  const response = await salonService.create(req.body, req.files);

  if (response.status === 200) {
    return await setrestaurantdb(response.resId, () =>
      res.status(response.status).send(response)
    );
  } else {
    await res.status(response.status).send(response);
  }
});

const update = catchAsync(async (req, res) => {
  const response = await salonService.update(req.body, req.files);
  res.status(response.status).send(response);
});

const remove = catchAsync(async (req, res) => {
  const response = await salonService.remove(req.body.id);
  res.status(response.status).send(response);
});

module.exports = {
  all,
  getSalonById,
  create,
  update,
  remove,
};
