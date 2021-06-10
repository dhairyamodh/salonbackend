const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const branchServiceSchema = mongoose.Schema(
    {
        salonId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Salon',
            required: true,
        },
        branchId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Branch',
            required: true,
        },
        categoryId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'SalonCategory',
            required: false,
        },
        serviceName: {
            type: String,
            required: true,
        },
        serviceImage: {
            type: String,
            required: true,
        },
        servicePrice: {
            type: Number,
            require: true
        },
        estimatedTime: {
            type: String,
            require: true
        },
        status: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
branchServiceSchema.plugin(toJSON);
branchServiceSchema.plugin(paginate);

const BranchService = mongoose.model('BranchService', branchServiceSchema);

module.exports = { branchServiceSchema, BranchService }
