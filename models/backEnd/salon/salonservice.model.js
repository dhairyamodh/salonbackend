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
salonServiceSchema.plugin(toJSON);
salonServiceSchema.plugin(paginate);

const SalonService = mongoose.model('SalonService', salonServiceSchema);

module.exports = { salonServiceSchema, SalonService }
