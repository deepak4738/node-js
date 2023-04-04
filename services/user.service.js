const httpStatus = require('http-status');
const { User } = require('../models/index');
const ApiError = require('../utils/ApiError');

const createUser = async(userBody) => {
    if(await User.IsEmailTaken(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exist');
    } 
    return User.create(userBody);
};

const getUserByEmail = async(email) => {
    return User.findOne({
            where: { email: email },
        });
}

module.exports = {
    createUser,
    getUserByEmail
};