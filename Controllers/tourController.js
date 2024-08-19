//const express = require('express');
// const { getRounds } = require('bcrypt');
const AppError = require('../utils/appError');
const Tour = require('./../Models/tourModel');
const catchAsync = require('./../utils/catchAsync');
//const ApiFeatures = require('./../utils/apiFeature');
const CatchAsync = require('./../utils/catchAsync');
const handlerFactory = require('./handlerFactory');

exports.deleteTour = handlerFactory.deleteOne(Tour);
// exports.deleteTours = CatchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   if (!tour) {
//     return next(new AppError('can not find tour with this id', 404));
//   }
//   res.status(204).json({
//     //(204)  kind of standars //
//     status: 'success',
//     data: null
//   });
// });
exports.getAllTours = handlerFactory.getAll(Tour);
// exports.getAllTours = CatchAsync(async (req, res, next) => {
//   const features = new ApiFeatures(Tour.find(), req.query)
//     .Filter()
//     .sort()
//     .fields()
//     .pagination();
//   const tours = await features.query;

//   //Sending response
//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: {
//       tours
//     }
//   });
// });

exports.getTour = handlerFactory.getOne(Tour, { path: 'reviews' });
// exports.getTour = CatchAsync(async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id).populate('review');
//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour
//     }
//   });
// });

exports.createTour = handlerFactory.createOne(Tour);
// exports.createTour = CatchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       tours: newTour
//     }
//   });
// });

exports.updateTour = handlerFactory.updateOne(Tour);
// exports.updateTour = CatchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true
//   });
//   if (!tour) {
//     return next(new AppError('can not find tour with this id', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: tour
//     }
//   });
// });
exports.getTourWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    return next(
      new AppError(
        'please provide latitude and longitude in the format lat,lng'
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });
  res.status(200).json({
    status: 'sucess',
    results: tours.length,
    data: {
      data: tours
    }
  });
});
exports.getDistances = catchAsync(async (req, res, next) => {
  //('/tours-within/:distance/center/:latlng/unit/:unit')
  const { latlng, unit } = req.params;

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    return next(
      new AppError(
        'please provide latitude and longitude in the format lat,lng'
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier //  convert distances to KM
      }
    },
    {
      $project: {
        // the fields that we wants to keep
        distance: { $round: ['$distance', 0] },
        name: 1
      }
    }
  ]);
  res.status(200).json({
    status: 'success',
    results: distances.length,
    data: {
      data: distances
    }
  });
});

exports.getAllStats = CatchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingQuantities' },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $match: { _id: { $ne: 'EASY' } }
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});
exports.getMonthlyPlan = CatchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // // 2021
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        Tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTours: -1 }
    },
    {
      $limit: 12
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});
