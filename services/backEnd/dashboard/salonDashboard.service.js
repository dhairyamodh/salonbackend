const httpStatus = require("http-status");
const moment = require("moment");
const getFormattedDate = (date, format) => {
  return moment(date).utcOffset("+05:30").format(format);
};

const getToFix = (value, decimal) => {
  return value ? value.toFixed(decimal || 2) : 0;
};

const getDashboard = async (db, data) => {
  try {
    const order = await db.Order.aggregate([
      {
        $match: {
          $and: [
            {
              createdAt: {
                $gte: moment().startOf("day").toDate(),
                $lte: moment().endOf("day").toDate(),
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          saleAmount: { $sum: "$grandTotal" },
        },
      },
    ]);
    const expenseSale = await db.Expense.aggregate([
      {
        $match: {
          $and: [
            {
              createdAt: {
                $gte: moment().startOf("day").toDate(),
                $lte: moment().endOf("day").toDate(),
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: "$expensePrice" },
        },
      },
    ]);
    const allorder = await db.Order.find({
      createdAt: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lte: new Date().setHours(23, 59, 59, 999),
      },
    });

    const dineInOrder = await db.Order.find({
      createdAt: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lte: new Date().setHours(23, 59, 59, 999),
      },
      orderType: "0",
    });

    const parcelOrder = await db.Order.find({
      createdAt: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lte: new Date().setHours(23, 59, 59, 999),
      },
      orderType: "1",
    });

    const homeOrder = await db.Order.find({
      createdAt: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lte: new Date().setHours(23, 59, 59, 999),
      },
      orderType: "2",
    });

    const cashOrder = await db.Order.find({
      createdAt: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lte: new Date().setHours(23, 59, 59, 999),
      },
      paymentTypeId: "0",
    });

    const cardOrder = await db.Order.find({
      createdAt: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lte: new Date().setHours(23, 59, 59, 999),
      },
      paymentTypeId: "1",
    });

    const otherOrder = await db.Order.find({
      createdAt: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lte: new Date().setHours(23, 59, 59, 999),
      },
      paymentTypeId: "2",
    });
    const totalOrderTypes =
      dineInOrder.length + parcelOrder.length + homeOrder.length;
    const orderTypesChart = [
      getToFix(dineInOrder.length / totalOrderTypes, 2),
      getToFix(parcelOrder.length / totalOrderTypes, 2),
      getToFix(homeOrder.length / totalOrderTypes, 2),
    ];

    const totalPaymentTypes =
      cashOrder.length + cardOrder.length + otherOrder.length;
    const paymentTypesChart = [
      getToFix(cashOrder.length / totalPaymentTypes, 2),
      getToFix(cardOrder.length / totalPaymentTypes, 2),
      getToFix(otherOrder.length / totalPaymentTypes, 2),
    ];

    const chair = await db.Chair.count();
    const responseData = {
      saleAmount: order.length > 0 ? getToFix(order[0].saleAmount) : 0,
      totalOrders: allorder.length,
      totalExpenses:
        expenseSale.length > 0 ? getToFix(expenseSale[0].totalExpense) : 0,
      totalTables: chair,
    };

    // chart data

    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const orderdata = await Promise.all(
      months.map(async (month) => {
        const start = moment()
          .startOf("year")
          .add(month - 1, "month")
          .startOf("month")
          .toDate();
        const end = moment()
          .startOf("year")
          .add(month - 1, "month")
          .endOf("month")
          .toDate();
        const orderSale = await db.Order.aggregate([
          {
            $match: {
              $and: [
                {
                  createdAt: {
                    $gte: start,
                    $lte: end,
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
            },
          },
        ]);
        const expenseSale = await db.Expense.aggregate([
          {
            $match: {
              $and: [
                {
                  createdAt: {
                    $gte: start,
                    $lte: end,
                  },
                },
              ],
            },
          },
          {
            $group: {
              _id: null,
              totalExpense: { $sum: "$expensePrice" },
            },
          },
        ]);
        const numberOrder = await db.Order.find({
          createdAt: {
            $gte: start,
            $lte: end,
          },
        });
        const thisOrderSale = orderSale.length > 0 ? orderSale[0].all : 0;
        const thisExpenseSale =
          expenseSale.length > 0 ? expenseSale[0].totalExpense : 0;
        const thisNumberOfOrder = numberOrder.length;
        return {
          orderSale: thisOrderSale,
          expenseSale: thisExpenseSale,
          numberOfOrder: thisNumberOfOrder,
        };
      })
    );
    const revenue = orderdata.map((rev) => {
      return getToFix(rev.orderSale);
    });
    const expense = orderdata.map((epx) => {
      return getToFix(epx.expenseSale);
    });

    const numberOfOrder = orderdata.map((epx) => {
      return epx.numberOfOrder;
    });

    // list top 10 selling items
    const sellingorders = await db.Order.aggregate([
      {
        $match: {
          $and: [
            {
              "createdAt":
              {
                $gte: moment().startOf("month").toDate(),
                $lte: moment().endOf("month").toDate(),
              }
            },
          ]

        },

      },
    ])
    // console.log(sellingorders);
    // const sellingorders = await db.Order.find({
    //   createdAt: {
    //     $gte: moment().startOf("month").toDate(),
    //     $lte: moment().endOf("month").toDate(),
    //   },
    // });
    let items = [];
    sellingorders.map(async (order) => {
      let currentItems = order.orderItems;
      currentItems.forEach(async (currItem) => {
        let itemindex = items.findIndex(
          (indexItem) => indexItem.id === currItem.id
        );
        if (itemindex === -1) {
          let pushItem = currItem;
          let itemTotalSold = currItem.itemTotal;
          pushItem.totalSold = itemTotalSold;

          items.push(pushItem);
        } else {
          let totalSold = items[itemindex].totalSold
            ? items[itemindex].totalSold
            : 0;
          // console.log(currItem);

          let currentQuantity = items[itemindex].quantity;
          let currTotalSold = items[itemindex].totalSold + currItem.itemTotal;

          items[itemindex] = {
            ...items[itemindex],
            quantity: items[itemindex].quantity + currItem.quantity,
            totalSold: currTotalSold,
          };
        }
        //
      });
    });
    let sortedItems = items
      .sort((b, a) => a.quantity - b.quantity)
      .slice(0, 10);
    // top expenses

    const topExpenses = await db.Expense.aggregate([
      {
        $match: {
          $and: [
            {
              "createdAt":
              {
                $gte: moment().startOf("month").toDate(),
                $lte: moment().endOf("month").toDate(),
              }
            },
          ]

        },

      },
      {
        $lookup: {
          from: "branches",
          localField: "branchId",
          foreignField: "_id",
          as: "branches",
        }
      },
      {
        $unwind: '$branches'
      },
      {
        $addFields: {
          branchName: '$branches.branchName'
        }
      }
    ])

    let sortedExpenses = topExpenses
      .sort((b, a) => a.expensePrice - b.expensePrice)
      .slice(0, 10);


    // chart data
    const weeks = [1, 2, 3, 4, 5, 6, 7,];
    const weeklyorderdata = await Promise.all(
      weeks.map(async (week) => {
        const start = moment()
          .startOf("week")
          .add(week - 1, "day")
          .startOf("day")
          .toDate();
        const end = moment()
          .startOf("week")
          .add(week - 1, "day")
          .endOf("day")
          .toDate();
        const weekOrderSale = await db.Order.aggregate([
          {
            $match: {
              $and: [
                {
                  createdAt: {
                    $gte: start,
                    $lte: end,
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
            },
          },
        ]);
        const thisWeekOrderSale = weekOrderSale.length > 0 ? weekOrderSale[0].all : 0;
        return {
          weekOrderSale: thisWeekOrderSale,
        };
      })
    );
    const weeklyRevenue = weeklyorderdata.map((rev) => {
      return getToFix(rev.weekOrderSale);
    });


    return {
      status: httpStatus.OK,
      data: {
        iconsgrid: responseData,
        saleChart: { revenue: revenue },
        expenseChart: { expense: expense },
        orderLengthChart: { numberOfOrders: numberOfOrder },
        orderTypesChart: orderTypesChart,
        paymentTypesChart: paymentTypesChart,
        sortedItems: sortedItems,
        sortedExpenses: sortedExpenses,
        weeklyRevenue: { weeklyRevenue: weeklyRevenue }
      },
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

module.exports = {
  getDashboard,
};
