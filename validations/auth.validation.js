const Joi = require('joi');
const { password } = require('./custom.validation');

const login = {
  body: Joi.object().keys({
    mobile: Joi.string().required(),
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
  login,
  forgotPassword,
  resetPassword,
};
