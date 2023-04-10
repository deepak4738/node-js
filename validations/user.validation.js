const Joi = require('joi');

const createUser = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        role: Joi.string().required().valid('user', 'admin'),
    }),
};

const getUsers = {
    query: Joi.object().keys({
      name: Joi.string(),
      role: Joi.string(),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    }),
};

module.exports = {
    createUser,
    getUsers
};