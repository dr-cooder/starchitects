const { makeResizeListener, getWindowMeasurements } = require('./windowMeasurements.js');

const unitsHorizontalOuter = 384;
const unitsVerticalOuter = 576;
const unitsPaddingHorizontal = 32;
const unitsPaddingVertical = 32;
const unitsPerEm = 16;

const unitsHorizontalInner = unitsHorizontalOuter - 2 * unitsPaddingHorizontal;
const unitsVerticalInner = unitsVerticalOuter - 2 * unitsPaddingVertical;
const unitsHorizontalInnerHalf = unitsHorizontalInner / 2;

const getGridMeasurements = () => {
  const { width, height } = getWindowMeasurements();
  const widthPixelsPerUnit = width / unitsHorizontalOuter;
  const heightPixelsPerUnit = height / unitsVerticalOuter;
  if (heightPixelsPerUnit < widthPixelsPerUnit) {
    return {
      pixelsPerUnit: heightPixelsPerUnit,
      verticalFreeSpace: 0,
      horizontalOffset: width / 2 - heightPixelsPerUnit * unitsHorizontalInnerHalf,
      verticalOffset: heightPixelsPerUnit * unitsPaddingVertical,
    };
  }
  return {
    pixelsPerUnit: widthPixelsPerUnit,
    verticalFreeSpace: height - widthPixelsPerUnit * unitsVerticalOuter,
    horizontalOffset: widthPixelsPerUnit * unitsPaddingHorizontal,
    verticalOffset: widthPixelsPerUnit * unitsPaddingVertical,
  };
};

const useGridMeasurements = makeResizeListener(getGridMeasurements);

module.exports = {
  unitsHorizontalInner,
  unitsHorizontalInnerHalf,
  unitsVerticalInner,
  unitsPaddingHorizontal,
  unitsPaddingVertical,
  unitsPerEm,
  useGridMeasurements,
};
