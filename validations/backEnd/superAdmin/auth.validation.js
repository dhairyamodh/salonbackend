const Joi = require('joi');
const { password, objectId } = require('../../custom.validation');

const updateDetails = {
    body: Joi.object().keys({
        name: Joi.string().required().label("Name"),
        email: Joi.string().required().email().label("Email"),
        mobile: Joi.string().pattern(/^[0-9]{10}$/).messages({
            "string.base": "Sorry! It looks like something went wrong. Please try later",
            "string.pattern.base": "Mobile number must be a 10 digits number or Mobile number must be a number",
        }),
        address: Joi.string()
    }).unknown(),
};

module.exports = {
    updateDetails
};
