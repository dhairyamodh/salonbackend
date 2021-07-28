const httpStatus = require("http-status");


const all = async (salonId, branchId, status) => {
  try {
    // const data = { ...(branchId != 'all' && { branchId: ObjectId(branchId) }) }
    const offers =

      await global.salons[salonId].Offers.find({
        ...status,
      })

    const newOffer = await Promise.all(
      offers.map(async (item) => {
        let serviceLabel = [];
        if (item.services) {
          item.services.map((service, index) => {
            serviceLabel.push(service.label);
          });
        }
        return { ...item._doc, servicesWithComma: serviceLabel.join(", ") };
      })
    );
    return { status: httpStatus.OK, data: newOffer };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};


module.exports = {
  all,
};
