const Joi = require('joi');
const { password, objectId } = require('../../custom.validation');

const create = {
    body: Joi.object().keys({
        salonId: Joi.string().required(),
        branchName: Joi.string().required(),
        contactPerson: Joi.string().required(),
        contactNumber: Joi.string().required(),
        status: Joi.string().required()
    }).unknown(),
};

const update = {
    body: Joi.object().keys({
        salonId: Joi.string().required(),
        branchName: Joi.string().required(),
        contactPerson: Joi.string().required(),
        contactNumber: Joi.string().required(),
        status: Joi.boolean().required()
    }).unknown(),
};

module.exports = {
    create, update
};
