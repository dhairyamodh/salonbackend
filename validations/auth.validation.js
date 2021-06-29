const Joi = require('joi');
const { password, objectId, mobile } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    salonId: Joi.required().custom(objectId),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().custom(password),
    role: Joi.string()
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().custom(password),
  }),
};

const adminlogin = {
  body: Joi.object().keys({
    mobile: Joi.number().custom(mobile),
    password: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

module.exports = {
  register,
  login,
  adminlogin,
  forgotPassword,
  resetPassword,
};
