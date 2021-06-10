const httpStatus = require("http-status");
const Subscription = require("../../../models/backEnd/superAdmin/subscription.model");
const all = async (status) => {
  try {
    const subscriptions = await Subscription.aggregate([
      { $match: status },
      {
        $lookup: {
          from: "restaurants",
          localField: "_id",
          foreignField: "subscriptionId",
          as: "restaurants",
        },
      },
      {
        $project: {
          subscriptionName: "$subscriptionName",
          subscriptionDuration: "$subscriptionDuration",
          subscriptionAmount: "$subscriptionAmount",

          status: "$status",
          subscription: "$$ROOT",
          subscribers: { $size: "$restaurants" },
        },
      },
    ]);
    return { status: httpStatus.OK, data: subscriptions };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const create = async (data) => {
  try {
    await Subscription.create(data);
    return {
      status: httpStatus.OK,
      message: "Subscription Added Successfully",
    };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const update = async (data) => {
  try {
    await Subscription.findByIdAndUpdate(data._id, data);
    return {
      status: httpStatus.OK,
      message: "Subscription Updated Successfully",
    };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const remove = async (data) => {
  try {
    await Subscription.findByIdAndDelete(data);
    return {
      status: httpStatus.OK,
      message: "Subscription Deleted Successfully",
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
