const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const orderSchema = mongoose.Schema(
    {
        salonId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'restaurants',
            required: true,
        },
        branchId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'branches',
            required: false,
        },
        orderNumber: {
            type: Number,
            required: true,
            default: 1
        },
        branchOrderNumber: {
            type: String,
            required: false,
        },
        orderItems: {
            type: Array,
            required: true,
        },
        itemsTotal: {
            type: Number,
            required: true,
        },
        taxCharges: {
            type: Number,
            required: true,
        },
        taxPercentage: {
            type: Number,
            required: false,
        },
        paymentType: {
            type: String,
            required: false,
        },
        paymentTypeId: {
            type: String,
            required: false,
        },
        otherCharges: {
            type: Number,
            required: false,
        },
        discount: {
            type: Number,
            required: false,
        },
        grandTotal: {
            type: Number,
            required: true,
        },
        isPaid: {
            type: String,
            default: true,
        },
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'users',
            required: false,
        },
        userName: {
            type: String,
            required: false,
        },
        userEmail: {
            type: String,
            required: false,
        },
        userMobile: {
            type: String,
            required: false,
        },
        startDate: {
            type: Date,
            required: false
        },
        startTime: {
            type: String,
            required: false
        },
        endDate: {
            type: Date,
            required: false
        }

    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

const Order = mongoose.model('Order', orderSchema);

module.exports = { orderSchema, Order }
