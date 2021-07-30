const httpStatus = require("http-status");
const {
  salonDashboardService,
  // branchDashboardService,
} = require("../dashboard");
const userType = (db, data) => {
  switch (data.role) {
    case "salonadmin":
      return salonDashboardService.getDashboard(db, data);
    // case "branchadmin":
    //   return branchDashboardService.getDashboard(db, data);
    default:
      break;
  }
};
const all = async (db, data) => {
  try {
    const response = await userType(db, data);
    return { status: httpStatus.OK, data: response.data };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

module.exports = {
  all,
};
