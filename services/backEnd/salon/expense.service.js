const httpStatus = require("http-status");

const all = async (salonId, branchId, start, end) => {

  try {
    const startDate = start.split("T")[0]
    const endDate = end.split("T")[0]
    const data = (branchId != undefined && { branchId: ObjectId(branchId) })
    const expenses = await global.salons[salonId].Expense.find({
      "createdAt": {
        $gte: new Date(startDate).setHours(0, 0, 0, 0),
        $lte: new Date(endDate).setHours(23, 59, 59, 999),
      },
      // ...data
    });

    return { status: httpStatus.OK, data: expenses };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const create = async (data, files) => {
  try {
    await global.salons[data.salonId].Expense.create(
      data,
    );
    return { status: httpStatus.OK, message: "Expense Added Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const update = async (data, files) => {
  try {

    await global.salons[data.salonId].Expense.findByIdAndUpdate(
      data.id,
      {
        ...data,
      }
    );
    return { status: httpStatus.OK, message: "Expense Updated Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const remove = async (data) => {
  try {
    await global.salons[data.salonId].Expense.findByIdAndDelete(
      data.id
    );
    return { status: httpStatus.OK, message: "Expense Deleted Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

module.exports = {
  create,
  all,
  update,
  remove,
};
