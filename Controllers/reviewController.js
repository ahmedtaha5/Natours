const Review = require('./../Models/reviewModel');
const handlerFactory = require('./handlerFactory');
// const user = require('./../Models/userModel');

//const CatchAsync = require('./../utils/catchAsync');

exports.setTourUserIds = (req, res, next) => {
  // allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  // console.log(req.user);
  next();
};
exports.deleteReview = handlerFactory.deleteOne(Review);
exports.updateReview = handlerFactory.updateOne(Review);
exports.createReview = handlerFactory.createOne(Review);
exports.getAllReviews = handlerFactory.getAll(Review);
exports.getReview = handlerFactory.getOne(Review);

// exports.getAllReviews = CatchAsync(async (req, res, next) => {
//   // allow nested get review on a tour
//   let filter = {};
//   if (req.params.tourId) filter = { tour: req.params.tourId };
//   const reviews = await review.find(filter);

//   res.status(200).json({
//     status: 'success',
//     length: reviews.length,
//     reviews: {
//       reviews
//     }
//   });
// });
// exports.createReview = CatchAsync(async function(req, res, next) {
//   // if (!req.body.tour) req.body.tour = req.params.tourId;
//   // if (!req.body.user) req.body.user = req.user.id;
//   const newreview = await review.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       review: newreview
//     }
//   });
// });
