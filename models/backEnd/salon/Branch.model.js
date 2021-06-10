const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const branchSchema = mongoose.Schema(
    {
        salonId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Salon',
            required: true,
        },
        branchName: {
            type: String,
            required: true,
        },
        branchCode: {
            type: String,
            required: true,
        },
        contactPerson: {
            type: String,
            require: true,
        },
        contactNumber: {
            type: String,
            require: false
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
branchSchema.plugin(toJSON);
branchSchema.plugin(paginate);

const Branch = mongoose.model('Branch', branchSchema);

module.exports = { branchSchema, Branch }
