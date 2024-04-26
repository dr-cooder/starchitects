// https://www.geeksforgeeks.org/implementation-queue-javascript/
class Queue {
  constructor() {
    this.empty();
  }

  enqueue(item) {
    this.items[this.backIndex] = item;
    this.backIndex++;
    this.isNotEmpty = true;
  }

  dequeue() {
    if (this.isNotEmpty) {
      const { frontIndex } = this;
      const item = this.items[frontIndex];
      delete this.items[frontIndex];
      this.frontIndex++;
      if (this.frontIndex === this.backIndex) {
        this.isNotEmpty = false;
      }
      return item;
    }
    throw new RangeError();
  }

  empty() {
    this.items = {};
    this.frontIndex = 0;
    this.backIndex = 0;
    this.isNotEmpty = false;
  }
}

const px = (pixels) => `${pixels}px`;

const blurPx = (radiusPixels) => `blur(${px(radiusPixels)})`;

const seconds = (miliseconds) => `${miliseconds / 1000}s`;

const percent = (numberOutOfHundred, floor = false) => `${floor ? parseInt(numberOutOfHundred, 10) : parseFloat(numberOutOfHundred)}%`;

const randomInt = (maxExclusive) => Math.floor(Math.random() * maxExclusive);

const ensureNumber = (value) => Number(value) || 0;

const lerp = (a, b, t) => a + (b - a) * t;

const clamp01 = (value) => Math.max(0, Math.min(value, 1));
const isWithin01 = (value) => value >= 0 && value <= 1;

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

const shadeContrast = 0.65; // <-- This may be adjusted
const shadeContrastTimesTwo = 2 * shadeContrast;
const shadeContrastTimesNegativeTwo = -2 * shadeContrast;
const darkBasis = -0.5 * shadeContrast + 0.5;
const brightBasis = -1.5 * shadeContrast + 0.5;
const applyShadeToRGB = (rgb, shade) => {
  let multiply;
  let add;
  if (shade < 0.5) {
    multiply = shadeContrastTimesTwo * shade;
    add = darkBasis;
  } else {
    multiply = shadeContrastTimesNegativeTwo * shade + shadeContrastTimesTwo;
    add = shadeContrastTimesTwo * shade + brightBasis;
  }
  return rgb.map(
    (channel) => multiply * channel + add,
  );
};

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

const preventChildrenFromCalling = (callback) => (callback != null ? (event) => {
  const { currentTarget, target } = event;
  if (currentTarget === target) {
    callback(event);
  }
} : undefined);

const setIntervalWithInitialCall = (callback, ms) => {
  callback();
  return setInterval(callback, ms);
};

// I've learned the hard way that Safari is *very* unreliable when it comes to time-based events,
// hence the need to re-check every single frame
const setTimeoutBetter = (callback, ms) => {
  const startTime = Date.now();
  const timeChecker = () => {
    if (Date.now() - startTime < ms) {
      requestAnimationFrame(timeChecker);
    } else {
      callback();
    }
  };
  timeChecker();
};

const starIsBorn = ({ born }) => born;

module.exports = {
  Queue,
  px,
  blurPx,
  seconds,
  percent,
  randomInt,
  ensureNumber,
  lerp,
  clamp01,
  isWithin01,
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
  setIntervalWithInitialCall,
  setTimeoutBetter,
  starIsBorn,
};
