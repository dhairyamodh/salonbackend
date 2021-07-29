const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const salonSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        address: {
            type: String,
            required: true,
        },
        contactPerson: {
            type: String,
            require: true,
        },
        contactNumber: {
            type: Number,
            require: false
        },
        logo: {
            type: String,
            require: false,
        },
        tagLine: {
            type: String,
            require: false
        },
        themeId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'themes',
            required: true,
        },
        balance: {
            type: Number,
            require: false,
            default: 0,
        },
        gstNumber: {
            type: String,
            require: false,
        },
        taxPercentage: {
            type: Number,
            require: true,
        },
        role: {
            type: String,
            default: 'salon',
        },
        lastBranchCode: {
            type: Number,
            require: false,
        },
        currencyId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Currency',
            required: true,
        },
        domainName: {
            type: String,
            required: true
        },
        subscription: {
            subscriptionId: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Subscription',
            },
            startDate: {
                type: Date,
                require: false
            },
            endDate: {
                type: Date,
                require: false
            }
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);
salonSchema.plugin(toJSON);
salonSchema.plugin(paginate);
// add plugin that converts mongoose to json
const Salon = mongoose.models['Salon'] || mongoose.model('Salon', salonSchema);

module.exports = Salon;
