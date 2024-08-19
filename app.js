const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan'); // npm i morgan
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./Controllers/errorController');

const tourRouters = require('./Routes/tourRoutes');
const userRouters = require('./Routes/userRoutes');
const reviewRouters = require('./Routes/reviewRoutes');
const viewsRouters = require('./Routes/viewsRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) Global MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, '/public')));

// set security HTTP headers
app.use(helmet());
//Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//limit requests from the same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// body Parser , reading the data from the body into req.body
app.use(express.json());

// Data sanitization against NoSQL injection
app.use(mongoSanitize()); // { "$gt": "" }
// Data sanitization against xss
app.use(xss());

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'maxGroupSize',
      'price',
      'ratingsAverage',
      'ratingsQuantity',
      'difficulty'
    ]
  })
);

app.use((req, res, next) => {
  // console.log(req.headers);
  req.requestedTime = new Date().toISOString();
  next();
});
app.use('/', viewsRouters);
app.use('/api/v1/tours', tourRouters);
app.use('/api/v1/users', userRouters);
app.use('/api/v1/reviews', reviewRouters);

// لازم بنفس الترتيب ده . ليه ؟

//في اول سطر  app.all() عشان لو كتبنا

// هيقراها هي الاول

//fail وكده كل مره هيبقى

app.all('*', function(req, res, next) {
  //console.log(err.stack);
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

//comment from ahmed taha at 19-8
