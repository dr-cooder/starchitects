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
};
