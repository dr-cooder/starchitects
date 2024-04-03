const mongoose = require('mongoose');

let starModel = {};

const StarSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        default: "default-star-name"
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
        default: Date.now,
    },
});

// Converts a doc to JSON
StarSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    shape: doc.shape,
    starColor: doc.starColor,
    starShade: doc.starShade,
    dustType: doc.dustType,
    dustColor: doc.dustColor,
    dustShade: doc.dustShade,
    birthDate: doc.birthDate,
    id: doc._id,
});

StarModel = mongoose.model('Star', StarSchema);

module.exports = {
    StarModel
};