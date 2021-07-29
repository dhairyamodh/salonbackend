const httpStatus = require("http-status");

const all = async (db, branchId, status) => {
  try {
    const data = {
      // ...(branchId != undefined && { branchId: ObjectId(branchId) }),
      ...status,
    };
    const chair = await db.Chair.find(data);
    return { status: httpStatus.OK, data: chair };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const create = async (db, data) => {
  try {
    const checkchairNumber = await db.Chair.findOne({
      chairNumber: data.chairNumber,
      // branchId: data.branchId ? data.branchId : undefined
    });
    if (checkchairNumber)
      return {
        status: httpStatus.NOT_FOUND,
        message: "Chair number already exist!",
      };

    await db.Chair.create({
      ...data,
      chairNumber: data.chairNumber,
      chairPrice: parseFloat(data.chairPrice),
    });
    return { status: httpStatus.OK, message: "Chair Added Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const update = async (db, data) => {
  try {
    const checkchairNumber = await db.Chair.findOne({
      chairNumber: data.chairNumber,
    });
    if (checkchairNumber) {
      const checkchairNumberItem = await db.Chair.find({
        chairNumber: data.chairNumber,
        _id: data.id || data._id,
      });
      if (checkchairNumberItem.length <= 0) {
        return {
          status: httpStatus.NOT_FOUND,
          message: "Chair number already exist!",
        };
      }
    }
    await db.Chair.findByIdAndUpdate(data._id || data.id, {
      ...data,
      chairNumber: data.chairNumber,
      extraPrice: parseFloat(data.extraPrice),
    });
    return { status: httpStatus.OK, message: "Chair Updated Successfully" };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const remove = async (db, data) => {
  try {
    await db.Chair.findByIdAndDelete(data._id || data.id);
    return { status: httpStatus.OK, message: "Chair Deleted Successfully" };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

module.exports = {
  create,
  all,
  update,
  remove,
};
