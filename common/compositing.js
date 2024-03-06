const maskOffset = 0;
const changeableValueMapOffset = 1;
const changeableMaskOffset = 2;
const alphaOffset = 3;
const bytesPerPixel = 4;
const byteMax = 255;

const vidPartWidth = 360;
const vidPartHeight = 360;
const vidWidth = vidPartWidth * 2;
const vidHeight = vidPartHeight * 2;
const bytesPerVidPart = vidPartWidth * vidPartHeight * bytesPerPixel;
const vidFrameDurationMs = 1000 / 30;

const albedoBounds = [0, 0, vidPartWidth, vidPartHeight];
const shadingBounds = [vidPartWidth, 0, vidPartWidth, vidPartHeight];
const specularBounds = [0, vidPartHeight, vidPartWidth, vidPartHeight];
const grayscalesBounds = [vidPartWidth, vidPartHeight, vidPartWidth, vidPartHeight];

const saturationRadius = 0.25;
const valueRadius = 0.125;
const valueRange = 1 - 2 * valueRadius;

const starCanvasWidth = 360;
const starCanvasHeight = 360;
const starCanvasWidthHalf = starCanvasWidth / 2;
const starCanvasHeightHalf = starCanvasHeight / 2;

const starMinWidth = 240;
const starMinHeight = 240;
const starMinX = (starCanvasWidth - starMinWidth) / 2;
const starMinY = (starCanvasHeight - starMinHeight) / 2;

const starMaxWidth = 320;
const starMaxHeight = 320;
const starMaxX = (starCanvasWidth - starMaxWidth) / 2;
const starMaxY = (starCanvasHeight - starMaxHeight) / 2;

module.exports = {
  maskOffset,
  changeableValueMapOffset,
  changeableMaskOffset,
  alphaOffset,
  bytesPerPixel,
  byteMax,
  vidPartWidth,
  vidPartHeight,
  vidWidth,
  vidHeight,
  bytesPerVidPart,
  vidFrameDurationMs,
  albedoBounds,
  shadingBounds,
  specularBounds,
  grayscalesBounds,
  saturationRadius,
  valueRadius,
  valueRange,
  starCanvasWidth,
  starCanvasHeight,
  starCanvasWidthHalf,
  starCanvasHeightHalf,
  starMinWidth,
  starMinHeight,
  starMinX,
  starMinY,
  starMaxWidth,
  starMaxHeight,
  starMaxX,
  starMaxY,
};
