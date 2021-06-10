const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const categorySchema = mongoose.Schema(
    {
        categoryName: {
            type: String,
            require: true
        },
        categoryImage: {
            type: String,
            require: true
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
categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
