const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const branchProductSchema = mongoose.Schema(
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
        categoryId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'SalonItemCategory',
            required: false,
        },
        productName: {
            type: String,
            required: true,
        },
        productImage: {
            type: String,
            required: true,
        },
        productPrice: {
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
branchProductSchema.plugin(toJSON);
branchProductSchema.plugin(paginate);

const BranchProduct = mongoose.model('BranchProduct', branchProductSchema);

module.exports = { branchProductSchema, BranchProduct }
