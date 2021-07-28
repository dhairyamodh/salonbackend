const httpStatus = require("http-status");
const { Salon } = require("../../../models/backEnd/superAdmin");
const getBranchCode = (salonName, lastBranchCode) => {
  return `${salonName.split(" ").join("").slice(0, 3).toUpperCase()}${(
    lastBranchCode + 1
  )
    .toString()
    .padStart(2, "0")}`;
};
const getBranchBySalonId = async (data, status) => {
  try {
    let branch = [];
    if (data === "all") {
      await Promise.all(
        Object.values(global.salons).map(async (key) => {
          const currentBranch = await key.Branch.aggregate([
            { $match: status },
            {
              $lookup: {
                from: "SalonUser",
                localField: "_id",
                foreignField: "branchId",
                as: "users",
              },
            },
            // {
            //     $lookup: {
            //         from: "items",
            //         // localField: "_id",
            //         // foreignField: "chapter_id",
            //         as: "items",
            //         let: { status: '$status', branchId: '$_id' },
            //         pipeline: [
            //             {
            //                 $match: {
            //                     $expr: {
            //                         $and: [
            //                             { $eq: ['$$branchId', '$branchId'] },
            //                         ]
            //                     }
            //                 }
            //             },
            //             {
            //                 $sort: { _id: -1 }
            //             }
            //         ]
            //     }
            // },
            {
              $project: {
                salonId: "$salonId",
                branchName: "$branchName",
                branchCode: "$branchCode",
                contactPerson: "$contactPerson",
                contactNumber: "$contactNumber",
                status: "$status",
                userCount: { $size: "$users" },
                // itemCount: { $size: "$items" }
              },
            },
          ]);
          branch.push(...currentBranch);
          const branchData = await Promise.all(
            branch.map(async (values, index) => {
              if (values.salonId) {
                const salons = await Salon.findById(values.salonId);
                values.salonName = salons.name;
                return values;
              }
            })
          );
          branch = branchData;
        })
      );
    } else {
      branch = await global.salons[data].Branch.aggregate([
        { $match: status },
        {
          $lookup: {
            from: "restaurantusers",
            localField: "_id",
            foreignField: "branchId",
            as: "users",
          },
        },
        {
          $lookup: {
            from: "items",
            as: "items",
            let: { status: "$status", branchId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$$branchId", "$branchId"] }],
                  },
                },
              },
              {
                $sort: { _id: -1 },
              },
            ],
          },
        },
        {
          $project: {
            salonId: "$salonId",
            branchName: "$branchName",
            branchCode: "$branchCode",
            contactPerson: "$contactPerson",
            contactNumber: "$contactNumber",
            status: "$status",
            userCount: { $size: "$users" },
            itemCount: { $size: "$items" },
          },
        },
      ]);
      const branchData = await Promise.all(
        branch.map(async (values, index) => {
          if (values.salonId) {
            const salons = await Salon.findById(values.salonId);
            values.salonName = salons.name;
            return values;
          }
        })
      );
      branch = branchData;
    }
    return { status: httpStatus.OK, data: branch };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const create = async (data) => {
  try {
    const salon = await Salon.findById(data.salonId);
    if (
      await global.salons[data.salonId].Branch.create({
        ...data,
        branchCode: getBranchCode(salon.name, salon.lastBranchCode || 0),
      })
    ) {
      await Salon.findByIdAndUpdate(data.salonId, {
        $inc: { lastBranchCode: 1 },
      });
    }
    return { status: httpStatus.OK, message: "Branch Added Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const update = async (data) => {
  try {
    await global.salons[data.salonId].Branch.findByIdAndUpdate(data._id, data);
    return { status: httpStatus.OK, message: "Branch Updated Successfully" };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const remove = async (data) => {
  try {
    await global.salons[data.salonId].Branch.findByIdAndDelete(data._id);
    const newdata = { salonId: data.salonId, branchId: data._id };
    // await global.salons[data.salonId].BranchItemCategory.deleteMany(newdata);
    // await global.salons[data.salonId].BranchItem.deleteMany(newdata);
    // await global.salons[data.salonId].Order.deleteMany(newdata);
    // await global.salons[data.salonId].RestaurantUser.deleteMany(newdata);
    return { status: httpStatus.OK, message: "Branch Deleted Successfully" };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

module.exports = {
  create,
  getBranchBySalonId,
  update,
  remove,
};
