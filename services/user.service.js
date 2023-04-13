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

const getUserById = async(id) => {
    return User.findByPk(id);
};

const queryUsers = async (options) => {
    const offset = options.page * options.limit;
    const limit = options.limit;
    const users = await User.findAndCountAll({
            where: {role: 'user'},
            limit,
            offset
        });
    return users;
};

const updateUserById = async(userId, userBody) => {
    const user = await getUserById(userId);
    let toUpdate = [];
    let individualHooks = false;
    if(!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User Not found');
    }
    if(userBody.email && (await User.IsEmailTaken(userBody.email, userId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }

    if(userBody.email){
        toUpdate.push({
            email: userBody.email
        });
    }
    if(userBody.name){
        toUpdate.push({
            name: userBody.name
        });
    }
    if(userBody.password){
        toUpdate.push({
            password: userBody.password
        });
        individualHooks = true;
    }
    console.log(userBody);
    await User.update(
        userBody,
        { where: {id: userId},
        individualHooks: individualHooks,
    });
    const updated = await getUserById(userId);
    return updated;
}

const deleteUser = async(userId) => {
    const user = await getUserById(userId);
    if(!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User Not found');
    }
    await user.destroy();
    return user;
};

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    queryUsers,
    updateUserById,
    deleteUser
};