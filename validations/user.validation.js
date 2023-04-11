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
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    }),
};

const getUser = {
    params: Joi.object().keys({
        userId: Joi.number().integer(),
    }),
};

const updateUser = {
    params: Joi.object().keys({
        userId: Joi.number().integer(),
    }),
    body: Joi.object().keys({
        email: Joi.string().email(),
        password: Joi.string(),
        name: Joi.string()
    }).min(1),
};

const deleteUser = {
    params: Joi.object().keys({
        userId: Joi.number().integer(),
    }),
}

module.exports = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
};