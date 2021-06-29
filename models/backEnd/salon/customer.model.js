const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const customerSchema = mongoose.Schema(
    {
        salonId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Salon',
            required: true,
        },
        branchId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Branch',
            required: false,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: false,
            trim: true,
            lowercase: true,
        },
        mobile: {
            type: String,
            require: false,
        },
        status: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
customerSchema.plugin(toJSON);
customerSchema.plugin(paginate);

const Customer = mongoose.model('Customer', customerSchema);

module.exports = { Customer, customerSchema };

