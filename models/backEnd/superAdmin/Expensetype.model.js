const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const expenseTypeSchema = mongoose.Schema(
    {
        expenseType: {
            type: String,
            require: true
        },
        includeQuantity: {
            type: Boolean,
            require: false,
            default: false
        },
        status: {
            type: Boolean,
            default: true,
            require: true
        }
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
expenseTypeSchema.plugin(toJSON);
expenseTypeSchema.plugin(paginate);

const ExpenseType = mongoose.model('ExpenseType', expenseTypeSchema);

module.exports = ExpenseType;
