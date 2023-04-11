const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { UserService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await UserService.createUser(req.body);
  res.status(httpStatus.CREATED).send('User created');
});

const getUsers = catchAsync(async (req, res) => {
    const options = pick(req.query, ['limit', 'page']);
    const result = await UserService.queryUsers(options);
    res.send(result);
});

const getUser = catchAsync(async(req, res) => {
  const user = await UserService.getUserById(req.params.userId);
  if(!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async(req, res) => {
  const user =  await UserService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async(req, res) => {
  const user = await UserService.deleteUser(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
}