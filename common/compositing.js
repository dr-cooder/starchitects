const alphaOffset = 3;
const bytesPerPixel = 4;

const vidPartWidth = 360;
const vidPartHeight = 360;
const vidWidth = vidPartWidth * 3;
const vidHeight = vidPartHeight;
const bytesPerVidPart = vidPartWidth * vidPartHeight * bytesPerPixel;
const vidFrameDurationMs = 1000 / 30;

const blackBounds = [0, 0, vidPartWidth, vidPartHeight];
const bwDiffBounds = [vidPartWidth, 0, vidPartWidth, vidPartHeight];
const alphaBounds = [vidPartWidth * 2, 0, vidPartWidth, vidPartHeight];

const starCanvasWidth = 360;
const starCanvasHeight = 360;

const starMinWidth = 240;
const starMinHeight = 240;
const starMinX = (starCanvasWidth - starMinWidth) / 2;
const starMinY = (starCanvasHeight - starMinHeight) / 2;

const starMaxWidth = 320;
const starMaxHeight = 320;
const starMaxX = (starCanvasWidth - starMaxWidth) / 2;
const starMaxY = (starCanvasHeight - starMaxHeight) / 2;

module.exports = {
  alphaOffset,
  bytesPerPixel,
  vidPartWidth,
  vidPartHeight,
  vidWidth,
  vidHeight,
  bytesPerVidPart,
  vidFrameDurationMs,
  blackBounds,
  bwDiffBounds,
  alphaBounds,
  starCanvasWidth,
  starCanvasHeight,
  starMinWidth,
  starMinHeight,
  starMinX,
  starMinY,
  starMaxWidth,
  starMaxHeight,
  starMaxX,
  starMaxY,
};
