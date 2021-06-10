const Joi = require('joi');
const { password, objectId } = require('../../custom.validation');

const create = (data, isSuperadminRole) => {
    const schema = Joi.object({
        ...(!isSuperadminRole && { restaurantId: Joi.required().custom(objectId), branchId: Joi.custom(objectId), }),
        categoryName: Joi.string().required(),
        status: Joi.string().required(),
    }).unknown();
    return schema.validate(data);
}

const update = (data, isSuperadminRole) => {
    const schema = Joi.object({
        ...(!isSuperadminRole && { restaurantId: Joi.required().custom(objectId), branchId: Joi.custom(objectId), }),
        branchId: Joi.custom(objectId),
        categoryName: Joi.string().required(),
        status: Joi.string().required(),
    }).unknown();
    return schema.validate(data);
}

module.exports = {
    create, update
};
