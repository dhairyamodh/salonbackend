const httpStatus = require("http-status");
const { Currency } = require("../../../models/backEnd/superAdmin");

const all = async (data, status) => {
  try {
    const result = await Currency.find(status);
    const currencyNameWithCybol = await Promise.all(
      result.map((curr, currIndex) => {
        return {
          ...curr._doc,
          currencyNameWithCybol: `${curr._doc.currencyName} (${curr._doc.currencySymbol})`,
        };
      })
    );
    return { status: httpStatus.OK, data: currencyNameWithCybol };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const create = async (data) => {
  try {
    await Currency.create(data);
    return { status: httpStatus.OK, message: "Currency Added Successfully" };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const update = async (data) => {
  try {
    await Currency.findByIdAndUpdate(data._id || data.id, data);
    return {
      status: httpStatus.OK,
      message: "Currency Updated Successfully",
    };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const remove = async (data) => {
  try {
    await Currency.findByIdAndDelete(data);
    return {
      status: httpStatus.OK,
      message: "Currency Deleted Successfully",
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
