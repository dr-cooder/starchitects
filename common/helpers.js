const px = (pixels) => `${pixels}px`;

const blurPx = (radiusPixels) => `blur(${px(radiusPixels)})`;

const percent = (numberOutOfHundred, floor = false) => `${floor ? parseInt(numberOutOfHundred, 10) : parseFloat(numberOutOfHundred)}%`;

const ensureNumber = (value) => Number(value) || 0;

const lerp = (a, b, t) => a + (b - a) * t;

const clamp01 = (value) => Math.max(0, Math.min(value, 1));

const radianRange = 2 * Math.PI;
const num01ToRadianRange = (num01) => radianRange * num01;
const numRadianTo01Range = (numRadian) => numRadian / radianRange;

const degreeRange = 360;
const num01ToDegreeRange = (num01) => degreeRange * num01;

const byteRange = 255;
const num01ToByteRange = (num01) => byteRange * num01;
const rgb01ToByteRange = (rgb01) => rgb01.map(num01ToByteRange);

const colorToRGB = (hue) => {
  const hueTimes6 = hue * 6;
  return [
    Math.abs(hueTimes6 - 3) - 1,
    2 - Math.abs(hueTimes6 - 2),
    2 - Math.abs(hueTimes6 - 4),
  ].map(clamp01);
};

const applyShadeToRGB = (rgb, shade) => rgb.map(
  (channel) => lerp(channel, shade, 0.35),
);

// Assumes sin/cos take in values of range 0...2pi and returns a list of RGB channels of range 0...1
const colorShadeToRGB = (color, shade) => (
  applyShadeToRGB(colorToRGB(color), shade)
);

const vectorLengthNoSqrt = (vector) => vector.map((c) => c * c).reduce((a, b) => a + b);

const dictToElement = (tagName, dict) => {
  const element = document.createElement(tagName);
  const entries = Object.entries(dict);
  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i];
    if (value != null) {
      element.setAttribute(key, value);
    }
  }
  return element;
};

const commaJoin = (list) => list.join(', ');

const square = (value) => value * value;

const isMouseEvent = ({ type }) => type.startsWith('mouse');

const preventChildrenFromCalling = (callback) => (event) => {
  const { currentTarget, target } = event;
  if (currentTarget === target) {
    callback(event);
  }
};

const starIsBorn = ({ birthDate }) => birthDate != null;

module.exports = {
  px,
  blurPx,
  percent,
  ensureNumber,
  lerp,
  clamp01,
  num01ToRadianRange,
  numRadianTo01Range,
  num01ToDegreeRange,
  num01ToByteRange,
  rgb01ToByteRange,
  colorToRGB,
  applyShadeToRGB,
  colorShadeToRGB,
  vectorLengthNoSqrt,
  dictToElement,
  commaJoin,
  square,
  isMouseEvent,
  preventChildrenFromCalling,
  starIsBorn,
};
