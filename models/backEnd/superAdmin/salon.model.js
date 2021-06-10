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
        cgst: {
            type: Number,
            require: true,
        },
        sgst: {
            type: Number,
            require: true,
        },
        role: {
            type: String,
            default: 'resturant',
        },
        lastBranchCode: {
            type: Number,
            require: false,
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
