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

const starCanvasWidth = vidPartWidth;
const starCanvasHeight = vidPartHeight;

const starMinWidthPercent = 60;
const starMinHeightPercent = 60;
const starMinLeftPercent = (100 - starMinWidthPercent) / 2;
const starMinTopPercent = (100 - starMinHeightPercent) / 2;

const starMaxWidthPercent = 80;
const starMaxHeightPercent = 80;
const starMaxLeftPercent = (100 - starMaxWidthPercent) / 2;
const starMaxTopPercent = (100 - starMaxHeightPercent) / 2;

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
  starMinWidthPercent,
  starMinHeightPercent,
  starMinLeftPercent,
  starMinTopPercent,
  starMaxWidthPercent,
  starMaxHeightPercent,
  starMaxLeftPercent,
  starMaxTopPercent,
};
