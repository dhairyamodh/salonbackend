const httpStatus = require("http-status");
const { Category } = require("../../../models/backEnd/superAdmin");
const {
  categoryValidation,
} = require("../../../validations/backEnd/superAdmin");

const isSuperadminRole = (role) => {
  return role === "superadmin";
};

const isSalonAdminRole = (role) => {
  return role === "salonadmin";
};

const all = async (salonId, branchId, status) => {
  try {
    console.log(salonId);
    // const data = { ...(branchId != 'all' && { branchId: ObjectId(branchId) }) }
    const category =
      branchId != undefined
        ? await global.salons[salonId].BranchCategory.find({
          branchId: branchId,
          ...status,
        })
        : await global.salons[salonId].SalonCategory.find(status)


    return { status: httpStatus.OK, data: category };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const create = async (data, files) => {
  try {
    const { error } = categoryValidation.create(
      data,
      isSuperadminRole(data.role)
    );
    if (error) {
      console.log(error);
      return {
        status: httpStatus.NOT_FOUND,
        message: error.details[0].message,
      };
    }
    const checkCategory = isSalonAdminRole(data.role)
      ? await global.salons[data.salonId].SalonCategory.find({
        categoryName: data.categoryName,
      })
      : await global.salons[data.salonId].BranchCategory.find({
        categoryName: data.categoryName,
      });
    if (checkCategory.length > 0) {
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Category already exists",
      };
    }
    if (files) {
      files.map((file) => {
        data.categoryImage = file.destination + "/" + file.filename;
      });
    } else {
      data.categoryImage = "uploaded/salons/category/res_logo.png";
    }

    isSalonAdminRole(data.role)
      ? await global.salons[data.salonId].SalonCategory.create(data)
      : await global.salons[data.salonId].BranchCategory.create(data);
    return { status: httpStatus.OK, message: "Category Added Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const update = async (data, files) => {
  try {
    const { error } = categoryValidation.update(
      data,
      isSuperadminRole(data.role)
    );
    if (error) {
      return {
        status: httpStatus.NOT_FOUND,
        message: error.details[0].message,
      };
    }
    const checkCategory = isSuperadminRole(data.role)
      ? await Category.find({ categoryName: data.categoryName })
      : isSalonAdminRole(data.role)
        ? await global.salons[data.salonId].SalonCategory.find({
          categoryName: data.categoryName,
        })
        : await global.salons[data.salonId].BranchCategory.find({
          categoryName: data.categoryName,
        });
    if (checkCategory.length > 0) {
      if (
        !checkCategory.find((cate) => {
          return cate.id == data.id;
        })
      ) {
        return {
          status: httpStatus.INTERNAL_SERVER_ERROR,
          message: "Category already exists",
        };
      }
    }
    if (files) {
      files.map((file) => {
        data.categoryImage = file.destination + "/" + file.filename;
      });
    }
    isSuperadminRole(data.role)
      ? await Category.findByIdAndUpdate(data.id, data)
      : isSalonAdminRole(data.role)
        ? await global.salons[data.salonId].SalonCategory.findByIdAndUpdate(
          data.id,
          data
        )
        : await global.salons[data.salonId].BranchCategory.findByIdAndUpdate(
          data.id,
          data
        );
    return { status: httpStatus.OK, message: "Category Updated Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const remove = async (data) => {
  try {
    if (isSalonAdminRole(data.role)) {
      await global.salons[data.salonId].SalonCategory.findByIdAndDelete(
        data.id
      );
    } else {
      await global.salons[data.salonId].BranchCategory.findByIdAndDelete(
        data.id
      );
    }

    !isSalonAdminRole(data.role)
      ? await global.salons[data.salonId].BranchService.updateMany(
        { categoryId: data.id },
        { $set: { categoryId: undefined } }
      )
      : await global.salons[data.salonId].SalonService.updateMany(
        { categoryId: data.id },
        { $set: { categoryId: undefined } }
      );

    return { status: httpStatus.OK, message: "Category Deleted Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const importall = async (data) => {
  try {
    data.branchId
      ? await global.salons[data.salonId].BranchCategory.insertMany(data.data)
      : await global.salons[data.salonId].SalonCategory.insertMany(data.data);
    return { status: httpStatus.OK, message: "Category Imported Successfully" };
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
  importall,
};
