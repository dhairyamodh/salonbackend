const httpStatus = require("http-status");
const { colorLuminance } = require("../../commonFunction/functionList");
const { Salon, Theme, Currency } = require('../../models/backEnd/superAdmin')

const getSalonById = async (salonId, branchId, status) => {
  try {
    const salon = await Salon.findById(salonId)
    const theme = await Theme.findById(salon.themeId)
    const currency = await Currency.findById(salon.currencyId)
    let category
    if (global.salons[salonId] != undefined || salonId) {
      category = await global.salons[salonId].SalonCategory.find(status)
    }
    else if (branchId != undefined) {
      category = await global.salons[salonId].BranchCategory.find(status)
    }
    return ({ status: httpStatus.OK, data: { ...salon._doc, primaryColor: theme.primaryColor, secondaryColor: colorLuminance(theme.primaryColor, -0.2), currencySymbol: currency.currencySymbol } })
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
}


module.exports = {
  getSalonById,
};
