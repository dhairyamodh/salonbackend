const httpStatus = require("http-status");
const { Salon, Subscription, Theme } = require('../../../models/backEnd/superAdmin')
const { salonValidation } = require("../../../validations/backEnd/superAdmin");

const moment = require("moment");

var MongoClient = require("mongodb").MongoClient;

const all = async (status) => {
  try {
    const salon = await Salon.find(status);
    const newAllRes = await Promise.all(
      salon.map(async (value, index) => {
        let branchCount = [],
          userCount = [];
        if (global.salons[value.id] != undefined) {
          branchCount = await global.salons[value.id].Branch.find(status);
          userCount = await global.salons[value.id].SalonUser.find(
            status
          );
        }
        if (value.subscription.subscriptionId != undefined) {
          const subscription = await Subscription.findById(
            value.subscription.subscriptionId
          );
          value._doc.subscriptionName = subscription.subscriptionName;
          value._doc.startDate = moment(value.subscription.startDate).format(
            "DD-MM-YYYY"
          );
          value._doc.endDate = moment(value.subscription.endDate).format(
            "DD-MM-YYYY"
          );
        }
        return {
          ...value._doc,
          branchCount: branchCount.length,
          userCount: userCount.length,
        };
      })
    );
    return { status: httpStatus.OK, data: newAllRes };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const getSalonById = async (salonId, branchId, status) => {
  try {
    const salon = await Salon.findById(salonId)
    const theme = await Theme.findById(salon.themeId)
    let category
    if (global.salons[salonId] != undefined || salonId) {
      category = await global.salons[salonId].SalonCategory.find(status)
    }
    else if (branchId != undefined) {
      category = await global.salons[salonId].BranchCategory.find(status)
    }
    return ({ status: httpStatus.OK, data: { ...salon._doc, primaryColor: theme.primaryColor, secondaryColor: theme.secondaryColor } })
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
}

const create = async (data, files) => {
  try {
    const { error } = salonValidation.create(data);
    if (error) {
      console.log(error);
      return {
        status: httpStatus.NOT_FOUND,
        message: error.details[0].message,
      };
    }
    if (await Salon.findOne({ email: data.email })) {
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Email address already taken, please try again",
      };
    }
    if (files) {
      files.map((file) => {
        data.logo = file.destination + "/" + file.filename;
      });
    } else {
      data.logo = "uploaded/logo/res_logo.png";
    }
    const res = await Salon.create(data);
    return {
      status: httpStatus.OK,
      message: "Salon Added Successfully",
      resId: res._id,
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const update = async (data, files) => {
  try {
    const { error } = salonValidation.create(data);
    if (error) {
      console.log(error);
      return {
        status: httpStatus.NOT_FOUND,
        message: error.details[0].message,
      };
    }
    if (files) {
      files.map((file) => {
        data.logo = file.destination + "/" + file.filename;
      });
    }

    const salon = await Salon.findByIdAndUpdate(
      data._id || data.id,
      data
    );
    return {
      status: httpStatus.OK,
      message: "Salon Updated Successfully",
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const remove = async (data) => {
  const currRes = await Salon.findById(data);
  const restaurantName = currRes.name.split(" ").join("");
  try {
    const client = await MongoClient.connect("mongodb://localhost/");

    const db = client.db(restaurantName);

    if (db) {
      const deleting = await db.dropDatabase();
      if (deleting) {
        delete global.salons[data];
        await Salon.findByIdAndDelete(data);
        await User.deleteMany({ restaurantId: data });
        return {
          status: httpStatus.OK,
          message: "Salon Deleted Successfully",
        };
      } else {
        throw new Error({ message: "failed" });
      }
    }
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

module.exports = {
  all,
  getSalonById,
  create,
  update,
  remove,
};
