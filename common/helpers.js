const px = (pixels) => `${pixels}px`;

const percent = (numberOutOfHundred) => `${parseInt(numberOutOfHundred, 10)}%`;

const vectorLengthNoSqrt = (vector) => vector.map((c) => c * c).reduce((a, b) => a + b);

module.exports = { px, percent, vectorLengthNoSqrt };
