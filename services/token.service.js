const jwt = require('jsonwebtoken');
const moment  = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const userService = require('./user.service');
const { Token } = require('../models');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type,
    };
    return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async(token, userId, expires, type, blacklisted = false) => {
    const tokenDoc = await Token.create({
        token,
        userId, 
        expires: expires.toDate(),
        type,
        blacklisted,
    });
    return tokenDoc;
};


/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthToken = async(user) => {
    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);

    await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

    return {
        access: {
          token: accessToken,
          expires: accessTokenExpires.toDate(),
        },
        refresh: {
          token: refreshToken,
          expires: refreshTokenExpires.toDate(),
        },
      };
};

const generateResetPasswordToken = async(email) => {
    const user = await userService.getUserByEmail(email);
    if(!user){
        throw new ApiError(httpStatus.NOT_FOUND, 'No user found');
    }
    const expires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const token = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
    await saveToken(token, user.id, expires, tokenTypes.RESET_PASSWORD);
    return token;
};

const verifyToken = async (token, type) => {
    const payload = jwt.verify(token, config.jwt.secret);
    const tokenDoc = await Token.findOne({
        where: { 
            token: token, 
            type: type, 
            userId: payload.sub, 
            blacklisted: false 
        }
    });
    
    if (!tokenDoc) {
      throw new Error('Token not found');
    }
    return tokenDoc;
};


module.exports = {
    generateToken, 
    saveToken,
    generateAuthToken,
    generateResetPasswordToken,
    verifyToken
}