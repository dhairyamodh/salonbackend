const httpStatus = require("http-status");
const { ExpenseType } = require("../../../models/backEnd/superAdmin");

const all = async (data, status) => {
  try {
    const result = await ExpenseType.find(status);
    return { status: httpStatus.OK, data: result };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const create = async (data) => {
  try {
    await ExpenseType.create(data);
    return {
      status: httpStatus.OK,
      message: "Expense type Added Successfully",
    };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const update = async (data) => {
  try {
    await ExpenseType.findByIdAndUpdate(data._id || data.id, data);
    return {
      status: httpStatus.OK,
      message: "Expense type Updated Successfully",
    };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const remove = async (data) => {
  try {
    await ExpenseType.findByIdAndDelete(data);
    return {
      status: httpStatus.OK,
      message: "Expense type Deleted Successfully",
    };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

module.exports = {
  all,
  create,
  update,
  remove,
};
