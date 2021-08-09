const httpStatus = require("http-status");
const moment = require("moment");
moment.suppressDeprecationWarnings = true;

const all = async (salonId, branchId, start, end) => {
  try {
    const startDate = start.split("T")[0];
    const endDate = end.split("T")[0];
    console.log(start, end, "sdd", startDate, endDate);
    const data = branchId != "all" && { branchId: ObjectId(branchId) };
    const orders = await global.salons[salonId].Order.find({
      createdAt: {
        $gte: new Date(startDate).setHours(0, 0, 0, 0),
        $lte: new Date(endDate).setHours(23, 59, 59, 999),
      },
      // ...data,
    });
    return { status: httpStatus.OK, data: orders };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

module.exports = {
  all,
};
