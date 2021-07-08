const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const salonUserGroupSchema = mongoose.Schema(
    {
        salonId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Salon',
            required: true,
        },
        groupName: {
            type: String,
            required: true,
        },
        services: {
            type: Array,
            require: true,
        },
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
salonUserGroupSchema.plugin(toJSON);
salonUserGroupSchema.plugin(paginate);

const SalonUserGroup = mongoose.model('SalonUserGroup', salonUserGroupSchema);

module.exports = { SalonUserGroup, salonUserGroupSchema };

