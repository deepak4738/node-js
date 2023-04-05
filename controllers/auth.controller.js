const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { UserService, TokeService, AuthService, EmailService } = require('../services/index');

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

const forgotPassword = catchAsync(async(req, res) => {
    const token = await TokeService.generateResetPasswordToken(req.body.email);
    await EmailService.sendResetPasswordEmail(req.body.email, token);
    res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async(req, res) => {
    await AuthService.resetPassword(req.query.token, req.body.password);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
};