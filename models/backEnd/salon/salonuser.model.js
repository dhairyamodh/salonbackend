const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const salonUserSchema = mongoose.Schema(
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
        groupId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'SalonUserGroup',
            required: false,
        },
        userName: {
            type: String,
            required: true,
        },
        userMobile: {
            type: String,
            require: true,
        },
        userRole: {
            type: String,
            require: true,
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
salonUserSchema.plugin(toJSON);
salonUserSchema.plugin(paginate);

const SalonUser = mongoose.model('SalonUser', salonUserSchema);

module.exports = { SalonUser, salonUserSchema };

