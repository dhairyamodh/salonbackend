const Joi = require('joi');
const { password, objectId } = require('../../custom.validation');

const create = (data) => {
    const schema = Joi.object({
        salonId: Joi.required().custom(objectId),
        // branchId: Joi.custom(objectId),
        // categoryId: Joi.custom(objectId),
        estimatedTime: Joi.string().required().label('Estimated Time'),
        name: Joi.string().required().label('Service Name'),
        price: Joi.number().label('Service Price'),
        status: Joi.string().required(),
    }).unknown();
    return schema.validate(data);
}

const update = (data) => {
    const schema = Joi.object({
        salonId: Joi.required().custom(objectId),
        // categoryId: Joi.custom(objectId),
        estimatedTime: Joi.string().required().label('Estimated Time'),
        name: Joi.string().required().label('Service Name'),
        price: Joi.number().label('Service Price'),
        status: Joi.string().required(),
    }).unknown();
    return schema.validate(data);
}

module.exports = {
    create, update
};
