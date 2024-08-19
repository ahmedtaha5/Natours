const AppError = require('../utils/appError');

const handleTokenExpiredErrorDB = () => {
  return new AppError('your token has expired! please log in again.', 401);
};

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleJWTErrorDB = () => {
  return new AppError('invalid token. please log in again.', 401);
};

const handleDuplicateFieldsDB = err => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operation, trusted error: send message to Client
  // console.log(err.isOperational);
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
    // Programming or other unkown error happened: don't leak error details
  } else {
    // Log error in the console
    console.log('💥ERROR: ', err);
    // Send error to the user
    res.status(500).json({
      status: 'error',
      message: 'Something wrong happened.'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, name: err.name, code: err.code };

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTErrorDB();
    if (error.name === 'TokenExpiredError') {
      error = handleTokenExpiredErrorDB();
    }
    sendErrorProd(error, res);
  }

  next();
};
