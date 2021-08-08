const Joi = require('joi');
const { password, objectId } = require('../../custom.validation');

const create = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        address: Joi.string().required(),
        contactPerson: Joi.string().required(),
        contactNumber: Joi.number().integer(),
        tagLine: Joi.string(),
        themeId: Joi.string().required(),
        themeId: Joi.string().required(),
        logo: Joi.string(),
        taxPercentage: Joi.number().required(),
        // balance: Joi.number().required(),
        // cgst: Joi.number().integer().required(),
        // sgst: Joi.number().integer().required(),
        status: Joi.string().required()
    }).unknown();
    return schema.validate(data);
}

// const getOne = {
//   params: Joi.object().keys({
//     userId: Joi.string().custom(objectId),
//   }),
// };

// const update = {
//   params: Joi.object().keys({
//     userId: Joi.required().custom(objectId),
//   }),
//   body: Joi.object()
//     .keys({
//       email: Joi.string().email(),
//       password: Joi.string().custom(password),
//       name: Joi.string(),
//     })
//     .min(1),
// };

// const deleteRes = {
//   params: Joi.object().keys({
//     userId: Joi.string().custom(objectId),
//   }),
// };

module.exports = {
    create,
};
