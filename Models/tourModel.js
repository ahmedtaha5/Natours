const mongoose = require('mongoose');
//const validator = require('validator');
//const User = require('./userModel');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour should have a name'],
      trim: true,
      maxLength: [40, 'the tour length should be less than or equal 40'],
      minLength: [10, 'the tour length should be more than or equal 10']
      //validate: [validator.isAlpha, 'Tour name must only contains characters'] //cahracters only allowed (no spaces or numbers allowed)
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'Tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour must have a Max Group Size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be easy, medium or difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'rating must be bigger than or equal to 1 '],
      max: [5, 'rating must be smaller than or equal to 5 '],
      set: val => Math.round(val * 10) / 10
      // set: val => val.toFixed(1)
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'Tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          return val < this.price;
        },
        message: 'the price discount should be less than the price'
      }
    },
    summary: {
      type: String,
      required: [true, 'Tour must have  a summary'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'tour should have a description']
    },
    imageCover: {
      type: String,
      required: [true, 'the should have a cover image']
    },
    startDates: [Date],
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startLocation: {
      //  GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    Locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('Duration in weeks').get(function() {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v'
  });

  next();
});

// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

//DOCUMENT MIDDLEWARE Works with save() and create() ONLY!! / Save named the hook
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function(next) {
//   console.log('u r in pre middleware');
//   next();
// });

// tourSchema.post('save', function(next, doc) {
//   console.log(doc);
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
