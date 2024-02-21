const px = (pixels) => `${pixels}px`;

const percent = (numberOutOfHundred) => `${parseInt(numberOutOfHundred, 10)}%`;

module.exports = { px, percent };
