const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    mobile: {
      type: String,
      require: true,
      unique: true,
    },
    salonId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Salon',
      required: false,
    },
    salonUserId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
      required: false,
    },
    branchId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'branches',
      required: false,
    },
    role: {
      type: String,
      default: 'superadmin',
    },
    otp: {
      type: String,
      require: false
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

const User = mongoose.model('User', userSchema);

module.exports = User;
