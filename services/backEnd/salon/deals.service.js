const httpStatus = require("http-status");

const all = async (salonId, branchId, status) => {
  try {
    // const data = { ...(branchId != 'all' && { branchId: ObjectId(branchId) }) }
    const deals =
      await global.salons[salonId].Deals.find(status)


    return { status: httpStatus.OK, data: deals };
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

    await global.salons[data.salonId].Deals.findByIdAndUpdate(
      data.id,
      data
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
      data.id
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
