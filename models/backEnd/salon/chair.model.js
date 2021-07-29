const mongoose = require("mongoose");
const { toJSON, paginate } = require("../../plugins");

const chairSchema = mongoose.Schema(
  {
    salonId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "salons",
      required: true,
    },
    branchId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "branches",
      required: false,
    },
    // actualTableNumber: {
    //   type: Number,
    //   required: true,
    // },
    chairNumber: {
      type: String,
      required: true,
    },
    chairTypeId: {
      type: String,
      required: false,
    },
    chairType: {
      type: String,
      required: true,
      default: 'all'
    },
    chairPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
chairSchema.plugin(toJSON);
chairSchema.plugin(paginate);

const Chair = mongoose.model("Chair", chairSchema);

module.exports = { chairSchema, Chair };
