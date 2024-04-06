const mongoose = require('mongoose');

let StarModel = {};

const StarSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    default: 'default-star-name',
  },
  shape: {
    type: Number,
    required: true,
  },
  starColor: {
    type: mongoose.Decimal128,
    required: true,
  },
  starShade: {
    type: mongoose.Decimal128,
    required: true,
  },
  dustType: {
    type: Number,
    required: true,
  },
  dustColor: {
    type: mongoose.Decimal128,
    required: true,
  },
  dustShade: {
    type: mongoose.Decimal128,
    required: true,
  },
  birthDate: {
    type: Date,
  },
  born: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// Converts a doc to JSON
StarSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  shape: doc.shape,
  starColor: parseFloat(doc.starColor),
  starShade: parseFloat(doc.starShade),
  dustType: doc.dustType,
  dustColor: parseFloat(doc.dustColor),
  dustShade: parseFloat(doc.dustShade),
  birthDate: doc.birthDate,
  born: doc.born,
  id: doc._id,
});

StarSchema.statics.getBornStars = async () => {
  const stars = await StarModel.find({ born: true });
  return stars;
};

StarModel = mongoose.model('Star', StarSchema);

module.exports = StarModel;
