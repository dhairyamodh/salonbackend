const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const branchCategorySchema = mongoose.Schema(
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
        SalonCategoryId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'SalonCategory',
        },
        categoryName: {
            type: String,
            required: true,
        },
        categoryImage: {
            type: String,
            required: true,
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
branchCategorySchema.plugin(toJSON);
branchCategorySchema.plugin(paginate);

const BranchCategory = mongoose.model('BranchCategory', branchCategorySchema);

module.exports = { branchCategorySchema, BranchCategory }
