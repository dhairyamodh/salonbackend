const httpStatus = require("http-status");
const { colorLuminance } = require("../../commonFunction/functionList");
const { Salon, Theme, Currency } = require('../../models/backEnd/superAdmin')
const moment = require('moment')

const getSalonById = async (salonId, branchId, status) => {
  try {
    const salon = await Salon.findById(salonId)
    const theme = await Theme.findById(salon.themeId)
    const currency = await Currency.findById(salon.currencyId)

    const hours = [];
    const startHour = 10;
    const endHour = 20
    for (let hour = startHour; hour < 24; hour++) {

      hours.push(moment({ hour }).format('h:mm A'));
      if (endHour == hour) {
        break;
      }
      hours.push(
        moment({
          hour,
          minute: 30
        }).format('h:mm A')
      );
    }

    let category
    if (global.salons[salonId] != undefined || salonId) {
      category = await global.salons[salonId].SalonCategory.find(status)
    }
    else if (branchId != undefined) {
      category = await global.salons[salonId].BranchCategory.find(status)
    }
    let lighterColor = colorLuminance(theme.primaryColor, 50);
    if (lighterColor == '#ffffff') {
      lighterColor = colorLuminance(theme.primaryColor, 45);

    }
    let secondaryLight = colorLuminance(theme.secondaryColor, 40);

    if (secondaryLight == '#ffffff') {
      secondaryLight = colorLuminance(theme.secondaryColor, 35);
    }
    return ({ status: httpStatus.OK, data: { ...salon._doc, primaryLight: lighterColor, primaryColor: theme.primaryColor, primaryDark: colorLuminance(theme.primaryColor, -10), secondaryColor: theme.secondaryColor, secondaryLight: secondaryLight, currencySymbol: currency.currencySymbol, workingHours: hours } })
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
}


module.exports = {
  getSalonById,
};
