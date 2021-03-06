const Joi = require('joi');
const { password, objectId } = require('../../custom.validation');

const create = {
    body: Joi.object().keys({
        name: Joi.string().required().label("Name"),
        email: Joi.string().required().email().label("Email"),
        mobile: Joi.string().pattern(/^[0-9]{10}$/).messages({
            "string.base": "Sorry! It looks like something went wrong. Please try later",
            "string.pattern.base": "Invalid mobile number",
        }),
    }).unknown(),
};

module.exports = {
    create
};
