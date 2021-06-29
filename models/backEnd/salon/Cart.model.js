const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const cartSchema = mongoose.Schema(
    {
        salonId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Salon',
            required: true,
        },
        branchId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Branch',
            required: false,
        },
        customerId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Customer',
            required: true,
        },
        items: {
            type: Array,
            require: true
        }
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
cartSchema.plugin(toJSON);
cartSchema.plugin(paginate);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = { cartSchema, Cart }
