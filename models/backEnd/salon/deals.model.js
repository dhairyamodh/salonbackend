const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const dealsSchema = mongoose.Schema(
    {
        salonId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Salon',
            required: true,
        },
        dealTitle: {
            type: String,
            required: true,
        },
        dealSubTitle: {
            type: String,
            required: true,
        },
        dealDiscount: {
            type: Number,
            required: true,
        },
        dealCode: {
            type: String,
            required: true,
        },
        dealStartDate: {
            type: Date,
            required: true
        },
        dealEndDate: {
            type: Date,
            required: true
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
dealsSchema.plugin(toJSON);
dealsSchema.plugin(paginate);

const deals = mongoose.model('Deals', dealsSchema);

module.exports = { dealsSchema, deals }
