const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const expenseSchema = mongoose.Schema(
    {
        salonId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'salons',
            required: true,
        },
        branchId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'branches',
            required: false,
        },
        expenseTitle: {
            type: String,
            required: false
        },
        expensePrice: {
            type: Number,
            required: true,
            default: 0,
        },
        quantity: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
expenseSchema.plugin(toJSON);
expenseSchema.plugin(paginate);

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = { expenseSchema, Expense }
