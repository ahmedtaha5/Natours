//const fs = require('fs');
const User = require('./../Models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const handlerFactory = require('./handlerFactory');

const filterObj = (obj, ...allowed) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowed.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.getAllUsers = catchAsync(async (re, res, next) => {
  const users = await User.find();
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users }
  });
});
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1)check if trying to update password
  if (req.body.password || req.body.confirmPassword) {
    return next(new AppError('Wrong Route Please go to /UpdatePassword', 500));
  }

  // 1)Filter Body
  const filteredBody = filterObj(req.body, 'name', 'email');
  console.log(req.body);

  // 2)Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });
  console.log(req.body.id);
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false
  });
  res.status(204).json({
    status: 'success',
    data: null
  });
});
exports.createUser = (re, res) => {
  res.status(500).json({
    status: 'success',
    message: 'This route is not defined yet go to /signup instead'
  });
};
// exports.createUser = handlerFactory.createOne(User);
exports.getAllUsers = handlerFactory.getAll(User);
exports.getUser = handlerFactory.getOne(User);
// Do Not Update password with this.
exports.updateUser = handlerFactory.updateOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);
