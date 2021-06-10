const Joi = require('joi');
const { password, objectId } = require('../../custom.validation');

const create = {
    body: Joi.object().keys({
        restaurantId: Joi.string().required(),
        branchId: Joi.custom(objectId),
        hotkeyItemId: Joi.custom(objectId),
        hotkey: Joi.string().required(),
        status: Joi.string().required()
    }).unknown(),
};

const update = {
    body: Joi.object().keys({
        restaurantId: Joi.string().required(),
        branchId: Joi.custom(objectId),
        hotkeyItemId: Joi.custom(objectId),
        hotkey: Joi.string().required(),
        hotkeyItem: Joi.object().required(),
        status: Joi.string().required()
    }).unknown(),
};

module.exports = {
    create, update
};
