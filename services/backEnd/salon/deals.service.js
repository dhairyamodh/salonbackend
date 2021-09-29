const httpStatus = require("http-status");
const { DATETIMEFORMAT } = require("../../../commonFunction/objectList");
const moment = require('moment')

const all = async (salonId, branchId, status) => {
  try {
    // const data = { ...(branchId != 'all' && { branchId: ObjectId(branchId) }) }
    const deals = await global.salons[salonId].Deals.find(status)
    const newDeals = await Promise.all(deals.map((deal) => {
      return { ...deal._doc, dealStartDate: moment(deal._doc.dealStartDate).format(DATETIMEFORMAT), dealEndDate: moment(deal._doc.dealEndDate).format(DATETIMEFORMAT) }
    }))
    return { status: httpStatus.OK, data: newDeals };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const create = async (data) => {
  try {
    await global.salons[data.salonId].Deals.create(data);
    return { status: httpStatus.OK, message: "Deals Added Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const update = async (data) => {
  try {
    console.log('date', new Date(data.dealStartDate), new Date(data.dealEndDate));
    await global.salons[data.salonId].Deals.findByIdAndUpdate(
      data.id || data._id,
      { ...data, dealStartDate: new Date(data.dealStartDate), dealEndDate: new Date(data.dealEndDate) }
    );
    return { status: httpStatus.OK, message: "Deals Updated Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const remove = async (data) => {
  try {
    await global.salons[data.salonId].Deals.findByIdAndDelete(
      data.id || data._id
    );

    return { status: httpStatus.OK, message: "Deals Deleted Successfully" };
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
