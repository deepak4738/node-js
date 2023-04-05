const httpStatus = require('http-status');

const userService = require('./user.service');
const tokenService = require('./token.service');
const { User, Token } = require('../models/index');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');


/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */

const loginWithEmailPassword = async(email, password) => {
    const user  = await userService.getUserByEmail(email);
    if(!user || !(await User.isPasswordMatch(password, user.password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid username/password');
    }
    return user;
};

const logout = async(refreshToken) => {
    const refreshTokenDoc = await Token.findOne({
        token: refreshToken,
        type: tokenTypes.REFRESH,
        blacklisted: false
    });

    if(!refreshTokenDoc){
        throw new ApiError(httpStatus.NOT_FOUND, 'No token found');
    }

    await refreshTokenDoc.destroy();
};

const resetPassword  = async(token, newPassword) => {
    try {
        const tokenDoc = await tokenService.verifyToken(token, tokenTypes.RESET_PASSWORD);
        const user = await userService.getUserById(tokenDoc.userId);
        if(!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User Not found');
        }
        //update user password
        await User.update(
                {password: newPassword}, 
                {where: {id: tokenDoc.userId},
                individualHooks: true,
            });
        //destroy tokens
        await Token.destroy({
            where: {
                userId: tokenDoc.userId,
                type: tokenTypes.RESET_PASSWORD
            }
        });
    } catch(error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, error);
    }
    
};

module.exports = {
    loginWithEmailPassword,
    logout,
    resetPassword
}