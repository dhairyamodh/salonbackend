const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const salonServiceSchema = mongoose.Schema(
    {
        salonId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Salon',
            required: true,
        },
        categoryId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'SalonCategory',
            required: false,
        },
        name: {
            type: String,
            required: true,
        },
        imageSrc: {
            type: String,
            required: true,
        },
        salePrice: {
            type: Number,
            require: true
        },
        price: {
            type: Number,
            require: true
        },
        discount: {
            type: Number,
            require: true
        },
        estimatedTime: {
            type: String,
            require: true
        },
        description: {
            type: String,
            required: false,
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
salonServiceSchema.plugin(toJSON);
salonServiceSchema.plugin(paginate);

const SalonService = mongoose.model('SalonService', salonServiceSchema);

module.exports = { salonServiceSchema, SalonService }
