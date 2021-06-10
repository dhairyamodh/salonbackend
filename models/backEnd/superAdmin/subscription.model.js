const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const subscriptionSchema = mongoose.Schema(
  {
    subscriptionName: {
      type: String,
      require: true
    },
    subscriptionDuration: {
      type: String,
      required: true,
    },
    subscriptionAmount: {
      type: Number,
      required: true,
    },
    allowedUsers: {
      type: String,
      require: true,
    },
    allowedBranches: {
      type: String,
      require: true,
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
subscriptionSchema.plugin(toJSON);
subscriptionSchema.plugin(paginate);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
