const Joi = require('joi');
const { password, objectId } = require('../custom.validation');

const create = {
    body: Joi.object().keys({
        restaurantId: Joi.required().custom(objectId),
        branchId: Joi.custom(objectId),
        userName: Joi.string().required(),
        userMobile: Joi.string().required(),
        role: Joi.string().required(),
        status: Joi.string().required()
    }).unknown(),
};

const update = {
    body: Joi.object().keys({
        restaurantId: Joi.required().custom(objectId),
        branchId: Joi.custom(objectId),
        userName: Joi.string().required(),
        userMobile: Joi.string().required(),
        status: Joi.string().required()
    }).unknown(),
};

module.exports = {
    create, update
};
