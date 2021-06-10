const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const salonCategorySchema = mongoose.Schema(
    {
        salonId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Salon',
            required: true,
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
salonCategorySchema.plugin(toJSON);
salonCategorySchema.plugin(paginate);

const SalonCategory = mongoose.model('SalonCategory', salonCategorySchema);

module.exports = { salonCategorySchema, SalonCategory }
