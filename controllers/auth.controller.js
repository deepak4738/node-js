const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { UserService, TokeService, AuthService } = require('../services/index');

const register = catchAsync(async(req, res) => {
    const user = await UserService.createUser(req.body);
    res.status(httpStatus.CREATED).send({ user });
});

const login = catchAsync(async(req, res) => {
    const { email, password } = req.body;
    const user = await AuthService.loginWithEmailPassword(email, password);
    const token = await TokeService.generateAuthToken(user);
    res.send({ user, token });
});

const logout = catchAsync(async(req, res) => {
    await AuthService.logout(req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    register,
    login,
    logout
};