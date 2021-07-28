const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");
const User = require("../../../models/user.model");
const { Salon } = require("../../../models/backEnd/superAdmin");
const all = async (salonId, branchId, status) => {
  try {
    const data = {
      salonId: ObjectId(salonId),
      ...(branchId != undefined && { branchId: ObjectId(branchId) }),
    };
    let usergroups = [];
    if (salonId) {
      usergroups = await global.salons[salonId].SalonUserGroup.aggregate([
        {
          $match: data,
        },
        {
          $project: {
            groupName: "$groupName",
            services: "$services",
            salonId: "$salonId",
          },
        },
      ]);
    } else {
      usergroups = await global.salons[salonId].BranchUserGroup.aggregate([
        {
          $match: data,
        },
        {
          $project: {
            groupName: "$groupName",
            salonId: "$salonId",
            branchId: "$branchId",
            services: "$services",
          },
        },
      ]);
    }
    const userdata = await Promise.all(
      usergroups.map(async (item) => {
        let serviceLabel = [];
        if (item.services) {
          item.services.map((service, index) => {
            serviceLabel.push(service.label);
          });
        }
        return { ...item, servicesWithComma: serviceLabel.join(", ") };
      })
    );
    return { status: httpStatus.OK, data: userdata };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const create = async (data) => {
  try {

    if (data.services === []) {
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Services is required",
      };
    }
    await global.salons[data.salonId].SalonUserGroup.create(data);

    return { status: httpStatus.OK, message: "Group Added Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const update = async (data) => {
  try {
    await global.salons[data.salonId].SalonUserGroup.findByIdAndUpdate(
      data._id,
      data
    );
    return { status: httpStatus.OK, message: "Group Updated Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const remove = async (data) => {
  try {
    await global.salons[data.salonId].SalonUserGroup.findByIdAndDelete(
      data._id
    );
    await global.salons[data.salonId].SalonUserGroup.findOneAndDelete({
      restaurantUserId: data._id,
    });
    await User.findOneAndDelete({ restaurantUserId: data._id });
    return { status: httpStatus.OK, message: "User Deleted Successfully" };
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
