const httpStatus = require("http-status");

const all = async (salonId, branchId, status) => {
  try {
    const deals =
      await global.salons[salonId].Deals.find(status)
    return { status: httpStatus.OK, data: deals };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

module.exports = {
  all,
};
