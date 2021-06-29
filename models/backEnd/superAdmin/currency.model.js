const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const currencySchema = mongoose.Schema(
    {
        currencyName: {
            type: String,
            require: true
        },
        currencySymbol: {
            type: String,
            require: true
        },
        status: {
            type: Boolean,
            default: 'true',
            require: true
        }
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
currencySchema.plugin(toJSON);
currencySchema.plugin(paginate);

const Currency = mongoose.models['Currency'] || mongoose.model('Currency', currencySchema);

module.exports = Currency;
