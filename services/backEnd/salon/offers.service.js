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

const create = async (data, files) => {
  try {


    if (files) {
      files.map((file) => {
        data.offerImage = file.destination + "/" + file.filename;
      });
    } else {
      data.offerImage = "uploaded/salons/offers/res_logo.png";
    }


    await global.salons[data.salonId].Offers.create(data);
    return { status: httpStatus.OK, message: "offers Added Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const update = async (data, files) => {
  try {
    if (files) {
      files.map((file) => {
        data.offerImage = file.destination + "/" + file.filename;
      });
    }
    await global.salons[data.salonId].Offers.findByIdAndUpdate(
      data._id || data.id,
      data
    )
    return { status: httpStatus.OK, message: "offers Updated Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const remove = async (data) => {
  try {
    await global.salons[data.salonId].Offers.findByIdAndDelete(
      data._id || data.id
    );

    return { status: httpStatus.OK, message: "offers Deleted Successfully" };
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
};
