const px = (pixels) => `${pixels}px`;

const percent = (numberOutOfHundred) => `${parseInt(numberOutOfHundred, 10)}%`;

const lerp = (a, b, t) => a + (b - a) * t;

const clamp01 = (value) => Math.max(0, Math.min(value, 1));

const hueToRGB = (hue) => {
  const hueTimes6 = hue * 6;
  return [
    Math.abs(hueTimes6 - 3) - 1,
    2 - Math.abs(hueTimes6 - 2),
    2 - Math.abs(hueTimes6 - 4),
  ].map(clamp01);
};

const vectorLengthNoSqrt = (vector) => vector.map((c) => c * c).reduce((a, b) => a + b);

module.exports = {
  px,
  percent,
  lerp,
  clamp01,
  hueToRGB,
  vectorLengthNoSqrt,
};
