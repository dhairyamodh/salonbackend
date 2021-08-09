const httpStatus = require("http-status");
const moment = require("moment");
const { getToFix } = require("../../../commonFunction/functionList");
const getFormattedDate = (date, format) => {
  return moment(date).utcOffset("+05:30").format(format);
};

const getReport = async (db, data) => {
  try {
    const branchId =
      data.branchId != "all" ? ObjectId(data.branchId) : undefined;
    // const orderType = data.orderType != "all" ? data.orderType : undefined;
    // const paymentTypeId =
    //   data.paymentTypeId != "all" ? data.paymentTypeId : undefined;
    const iconOrder = await db.Order.aggregate([
      {
        $match: {
          // ...(branchId && { branchId: branchId }),
          // ...(paymentTypeId && { paymentTypeId: paymentTypeId }),
          $and: [
            {
              createdAt: {
                $gte: moment(data.date.start).startOf("day").toDate(),
                $lte: moment(data.date.end).endOf("day").toDate(),
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          all: {
            $sum: "$grandTotal",
          },
          // dineIn: {
          //   $sum: { $cond: [{ $eq: ["$orderType", "0"] }, "$grandTotal", 0] },
          // },
          // parcel: {
          //   $sum: { $cond: [{ $eq: ["$orderType", "1"] }, "$grandTotal", 0] },
          // },
          // homeDelivery: {
          //   $sum: { $cond: [{ $eq: ["$orderType", "2"] }, "$grandTotal", 0] },
          // },
        },
      },
    ]);

    if (iconOrder.length > 0) {
      iconOrder[0].all = getToFix(iconOrder[0].all);
      // iconOrder[0].dineIn = getToFix(iconOrder[0].dineIn);
      // iconOrder[0].parcel = getToFix(iconOrder[0].parcel);
      // iconOrder[0].homeDelivery = getToFix(iconOrder[0].homeDelivery);
    } else {
      iconOrder.push({ all: 0, dineIn: 0, parcel: 0, homeDelivery: 0 });
    }

    const order = await db.Order.aggregate([
      {
        $match: {
          ...(branchId && { branchId: branchId }),
          ...(orderType && { orderType: orderType }),
          ...(paymentTypeId && { paymentTypeId: paymentTypeId }),
          $and: [
            {
              createdAt: {
                $gte: moment(data.date.start).startOf("day").toDate(),
                $lte: moment(data.date.end).endOf("day").toDate(),
              },
            },
          ],
        },
      },
    ]);
    const orders = await Promise.all(
      order.map((value) => {
        return { ...value, itemsLength: value.orderItems.length };
      })
    );

    return {
      status: httpStatus.OK,
      data: { iconsgrid: iconOrder[0], table: orders },
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

module.exports = {
  getReport,
};
