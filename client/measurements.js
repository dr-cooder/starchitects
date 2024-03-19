const unitsHorizontalOuter = 392;
const unitsVerticalMinOuter = 588;
const unitsVerticalMaxOuter = 784;
const unitsPaddingHorizontal = 32;
const unitsPaddingVertical = 32;
const unitsBackgroundWidth = 784;
const unitsBackgroundHeight = 980;
const unitsPerEm = 16;

const unitsHorizontalInner = unitsHorizontalOuter - 2 * unitsPaddingHorizontal;
const unitsHorizontalInnerHalf = unitsHorizontalInner / 2;
const unitsVerticalMinInner = unitsVerticalMinOuter - 2 * unitsPaddingVertical;
const unitsVerticalMinInnerHalf = unitsVerticalMinInner / 2;
const unitsVerticalFreeSpaceMax = unitsVerticalMaxOuter - unitsVerticalMinOuter;
const unitsVerticalMaxInner = unitsVerticalMinInner + unitsVerticalFreeSpaceMax;

// Functions are dependent upon one another in order, but separate due to calculated
// information from further functions being unnecessary in some situations(?)

const getWindowMeasurements = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
};

const getPixelsPerUnit = () => {
  const { width, height } = getWindowMeasurements();
  const widthPixelsPerUnit = width / unitsHorizontalOuter;
  const heightMinPixelsPerUnit = height / unitsVerticalMinOuter;
  // Wider than width:heightMin
  const wide = heightMinPixelsPerUnit < widthPixelsPerUnit;
  return {
    width,
    height,
    pixelsPerUnit: wide ? heightMinPixelsPerUnit : widthPixelsPerUnit,
    wide,
  };
};

const getGridMeasurements = () => {
  const {
    width, height, pixelsPerUnit, wide,
  } = getPixelsPerUnit();
  // Wider than width:heightMin
  if (wide) {
    return {
      pixelsPerUnit,
      verticalFreeSpace: 0,
      horizontalOffset: width / 2 - pixelsPerUnit * unitsHorizontalInnerHalf,
      verticalOffset: pixelsPerUnit * unitsPaddingVertical,
    };
  }
  const heightMaxPixelsPerUnit = height / unitsVerticalMaxOuter;
  // Taller than width:heightMax
  if (pixelsPerUnit < heightMaxPixelsPerUnit) {
    return {
      pixelsPerUnit,
      verticalFreeSpace: pixelsPerUnit * unitsVerticalFreeSpaceMax,
      horizontalOffset: pixelsPerUnit * unitsPaddingHorizontal,
      verticalOffset: (height - pixelsPerUnit * unitsVerticalMaxInner) / 2,
    };
  }
  // Within variable verticalFreeSpace aspect ratio range
  return {
    pixelsPerUnit,
    verticalFreeSpace: height - pixelsPerUnit * unitsVerticalMinOuter,
    horizontalOffset: pixelsPerUnit * unitsPaddingHorizontal,
    verticalOffset: pixelsPerUnit * unitsPaddingVertical,
  };
};

module.exports = {
  unitsHorizontalInner,
  unitsHorizontalInnerHalf,
  unitsVerticalInner: unitsVerticalMinInner,
  unitsVerticalInnerHalf: unitsVerticalMinInnerHalf,
  unitsPaddingHorizontal,
  unitsPaddingVertical,
  unitsBackgroundWidth,
  unitsBackgroundHeight,
  unitsPerEm,
  getWindowMeasurements,
  getPixelsPerUnit,
  getGridMeasurements,
};
