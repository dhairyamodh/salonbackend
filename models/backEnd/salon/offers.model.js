const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const offersSchema = mongoose.Schema(
    {
        salonId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Salon',
            required: true,
        },
        offerTitle: {
            type: String,
            required: true,
        },
        offerSubTitle: {
            type: String,
            required: false,
        },
        offerImage: {
            type: String,
            // required: true,
        },
        services: {
            type: Array,
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
offersSchema.plugin(toJSON);
offersSchema.plugin(paginate);

const Offers = mongoose.model('Offers', offersSchema);

module.exports = { offersSchema, Offers }
