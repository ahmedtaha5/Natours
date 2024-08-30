const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', // Reference to the User model
    required: [true, 'Booking must belong to a user']
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour', // Reference to the Tour model
    required: [true, 'Booking must belong to a tour']
  },
  price: {
    type: Number,
    required: [true, 'booking must have a price']
  },
  paid: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

bookingSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'tour',
    select: 'name'
  }).populate('user');

  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
