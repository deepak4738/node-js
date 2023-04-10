const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { UserService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  //const user = await UserService.createUser(req.body);
  res.status(httpStatus.CREATED).send('User created');
});

const getUsers = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await UserService.queryUsers(filter, options);
    res.send(result);
  });

module.exports = {
    createUser,
    getUsers
}