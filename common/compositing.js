const alphaOffset = 3;
const bytesPerPixel = 4;

const vidPartWidth = 640;
const vidPartHeight = 640;
const vidWidth = vidPartWidth * 5;
const vidHeight = vidPartHeight;
const bytesPerVidPart = vidPartWidth * vidPartHeight * bytesPerPixel;
const vidFrameDurationMs = 1000 / 30;

const basisBounds = [0, 0, vidPartWidth, vidPartHeight];
const starDiffBounds = [vidPartWidth, 0, vidPartWidth, vidPartHeight];
const dustDiffBounds = [vidPartWidth * 2, 0, vidPartWidth, vidPartHeight];
const starTimesDustDiffBounds = [vidPartWidth * 3, 0, vidPartWidth, vidPartHeight];
const alphaBounds = [vidPartWidth * 4, 0, vidPartWidth, vidPartHeight];

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
  basisBounds,
  starDiffBounds,
  dustDiffBounds,
  starTimesDustDiffBounds,
  alphaBounds,
  starCanvasWidth,
  starCanvasHeight,
};
