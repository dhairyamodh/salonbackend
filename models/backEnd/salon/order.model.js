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
            required: true,
        },
        orderBy: {
            type: String,
            require: false
        },
        tableNumber: {
            type: String,
            require: false
        },
        orderItems: {
            type: Array,
            require: true,
        },
        itemsTotal: {
            type: Number,
            require: true,
        },
        cgstCharges: {
            type: Number,
            require: true,
        },
        sgstCharges: {
            type: Number,
            require: true,
        },
        otherCharges: {
            type: Number,
            require: true,
        },
        discount: {
            type: Number,
            require: true,
        },
        grandTotal: {
            type: Number,
            require: true,
        },
        paymentType: {
            type: String,
            require: true,
        },
        paymentTypeId: {
            type: String,
            require: true,
        },
        isPaid: {
            type: String,
            default: true,
        },
        customerMobile: {
            type: String,
            require: false
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
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

const Order = mongoose.model('Order', orderSchema);

module.exports = { orderSchema, Order }
