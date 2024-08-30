const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeature');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      // NULL is a fallcy value which will produce false
      return next(new AppError('No document found with that id!', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) {
      // NULL is a fallcy value which will produce false
      return next(new AppError('No document found with that id!', 404));
    }
    res.status(200).json({
      status: 'success',
      data: { doc }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate('review');
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // To allow nested GET reviews (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // Apply query features: filter, sort, limitFields, paginate
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .fields()
      .pagination();

    const doc = await features.query;

    // Check if doc is found
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: { data: doc } // corrected data structure to be more RESTful
    });
  });
