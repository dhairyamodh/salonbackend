const httpStatus = require("http-status");
const { Salon } = require("../../../models/backEnd/superAdmin");
const { DATETIMEFORMAT } = require("../../../commonFunction/objectList");
const moment = require("moment");
moment.suppressDeprecationWarnings = true;

const all = async (salonId, branchId, start, end) => {
  try {
    const startDate = start.split("T")[0];
    const endDate = end.split("T")[0];
    const orders = await global.salons[salonId].Order.find({
      createdAt: {
        $gte: new Date(startDate).setHours(0, 0, 0, 0),
        $lte: new Date(endDate).setHours(23, 59, 59, 999),
      },
      orderStatus: orderStatus
      // ...data,
    });
    return { status: httpStatus.OK, data: orders };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const getFilterBookings = async (data) => {
  try {
    const salonId = data.salonId
    const salonUserId = data.userId
    const startDate = data.date.start.split("T")[0];
    const endDate = data.date.end.split("T")[0];

    const orderStatus = data.orderStatus != "all" ? data.orderStatus : undefined;
    const employeeId = data.role == 'employee' ? salonUserId != undefined ? salonUserId : undefined : undefined
    const paymentTypeId =
      data.paymentTypeId != "all" ? data.paymentTypeId : undefined;
    const orders = await global.salons[salonId].Order.find({
      startDate: {
        $gte: new Date(startDate).setHours(0, 0, 0, 0),
        $lte: new Date(endDate).setHours(23, 59, 59, 999),
      },
      ...(paymentTypeId && { paymentTypeId: paymentTypeId }),
      ...(orderStatus && { orderStatus: orderStatus }),
      ...(employeeId && { employeeId: ObjectId(employeeId) })
      // ...data,
    });
    const filterOrders = [...orders.filter((a) => a.orderStatus == 'pending'), ...orders.filter((a) => a.orderStatus != 'pending')]
    return { status: httpStatus.OK, data: filterOrders };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
}

const create = async (data) => {
  try {
    const lastOrder = await global.salons[data.salonId].Order.find({
      branchId: data.branchId,
    })
      .sort({ _id: -1 })
      .limit(1);
    if (lastOrder.length > 0 && data.orderNumber == lastOrder[0].orderNumber) {
      data.orderNumber = lastOrder[0].orderNumber++;
      data.branchOrderNumber = data.branchCode + data.orderNumber++;
    } else {
      data.branchOrderNumber = data.branchCode + data.orderNumber;
    }
    const checkOrderNumber = await global.salons[data.salonId].Order.find({
      orderNumber: data.orderNumber,
    })
    if (checkOrderNumber.length > 0) {
      return { status: httpStatus.INTERNAL_SERVER_ERROR, message: "Order already exist" };
    }
    const order = await global.salons[data.salonId].Order.create(data);
    if (order) {
      if (data.customerMobile) {
        const currentCustomer = await global.salons[
          data.salonId
        ].Customer.findOne({ customerMobile: data.customerMobile });
        if (!currentCustomer) {
          await global.salons[data.salonId].Customer.create({
            ...data,
            totalOrders: 1,
            totalPrice: data.grandTotal,
          });
        } else {
          await global.salons[data.salonId].Customer.findByIdAndUpdate(
            currentCustomer._id,
            { ...data, $inc: { totalOrders: 1, totalPrice: data.grandTotal } }
          );
        }
      }
      await Salon.findByIdAndUpdate(data.salonId, {
        $inc: { balance: order.grandTotal },
      });
    }
    return {
      status: httpStatus.OK,
      message: "Order Added Successfully",
      data: {
        ...order._doc,
        createdAt: moment(order.createdAt).format(DATETIMEFORMAT),
        taxTotal: order.cgstCharges + order.sgstCharges,
      },
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const checkoutOrder = async (data) => {
  const createorder = await create(data)
  console.log(createorder);
  global.sendSocketMessage(JSON.stringify(createorder.data))
  return createorder;
};

const update = async (data) => {
  try {
    const updatedOrder = await global.salons[data.salonId].Order.findByIdAndUpdate(data.id, data, { new: true });
    return { status: httpStatus.OK, message: "Order Updated Successfully", data: updatedOrder };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const remove = async (data) => {
  try {
    await global.salons[data.salonId].Order.findByIdAndDelete(data.id);
    return { status: httpStatus.OK, message: "Order Deleted Successfully" };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const applyCoupon = async (db, data) => {
  try {
    const checkCouponCode = await db.Deals.findOne({ dealCode: data.coupon })
    if (checkCouponCode) {
      return ({ status: httpStatus.OK, data: checkCouponCode })
    }
    return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Invalid Code" })

  } catch (error) {
    console.log(error);
    return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
  }
}

const getOrderCount = async (data) => {
  try {
    console.log('data', data);
    const orders = await global.salons[data.salonId].Order.find({ isSeen: false }).count();
    console.log('orders', orders);
    return { status: httpStatus.OK, data: orders };
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
  getFilterBookings,
  checkoutOrder,
  applyCoupon,
  getOrderCount
};
