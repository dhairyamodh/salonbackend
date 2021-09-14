const httpStatus = require("http-status");
const moment = require('moment')

const all = async (salonId, branchId, status) => {
  try {
    const deals = await global.salons[salonId].Deals.find({
      ...status,
      dealEndDate: {
        $gte: moment().startOf("day").toDate(),
      },
    })
    console.log('deal', deals);
    return { status: httpStatus.OK, data: deals };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

module.exports = {
  all,
};
