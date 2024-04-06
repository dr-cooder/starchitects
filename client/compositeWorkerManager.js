const {
  bytesPerVidPart,
  vidPartWidth,
  vidPartHeight,
  vidWidth,
  vidHeight,
  vidFrameDurationMs,
  basisBounds,
  starDiffBounds,
  dustDiffBounds,
  starTimesDustDiffBounds,
  alphaBounds,
} = require('../common/compositing.js');
const { colorShadeToRGB, setIntervalWithInitialCall } = require('../common/helpers.js');
const {
  videos, misc, prepareVideo, removeAndRewindVideo,
} = require('./preload.js');

const compositeWorkerStates = {
  idle: 0,
  compositing: 1,
  queued: 2,
};

let starCompositeWorker;
let starCompositeWorkerState = compositeWorkerStates.idle;
let starVideoEl;

const starVideoCanvas = document.createElement('canvas');
starVideoCanvas.width = vidWidth;
starVideoCanvas.height = vidHeight;
const starVideoCtx = starVideoCanvas.getContext('2d', { willReadFrequently: true });
// document.body.appendChild(starVideoCanvas);

const starCompositeCanvas = document.createElement('canvas');
starCompositeCanvas.width = vidPartWidth;
starCompositeCanvas.height = vidPartHeight;
const starCompositeCtx = starCompositeCanvas.getContext('2d');
// document.body.appendChild(starCompositeCanvas);

let tryCompositeNextStarVideoFrameInterval;

const starCompositeParams = {
  starRGB: [1, 0, 0],
  dustRGB: [0, 1, 0],
  basisBytes: new Uint8ClampedArray(bytesPerVidPart),
  starDiffBytes: new Uint8ClampedArray(bytesPerVidPart),
  dustDiffBytes: new Uint8ClampedArray(bytesPerVidPart),
  starTimesDustDiffBytes: new Uint8ClampedArray(bytesPerVidPart),
  alphaBytes: new Uint8ClampedArray(bytesPerVidPart),
};

const tryCompositeStar = () => {
  if (starCompositeWorkerState === compositeWorkerStates.idle) {
    starCompositeWorkerState = compositeWorkerStates.compositing;
    starCompositeWorker.postMessage(starCompositeParams);
  } else {
    starCompositeWorkerState = compositeWorkerStates.queued;
  }
};

const tryCompositeNextStarVideoFrame = () => {
  // It seems cropping a larger video doesn't improve performance
  starVideoCtx.drawImage(starVideoEl, 0, 0);

  starVideoCtx.getImageData(...basisBounds);
  Object.assign(starCompositeParams, {
    basisBytes: starVideoCtx.getImageData(...basisBounds).data,
    starDiffBytes: starVideoCtx.getImageData(...starDiffBounds).data,
    dustDiffBytes: starVideoCtx.getImageData(...dustDiffBounds).data,
    starTimesDustDiffBytes: starVideoCtx.getImageData(...starTimesDustDiffBounds).data,
    alphaBytes: starVideoCtx.getImageData(...alphaBounds).data,
  });
  tryCompositeStar();
};

const stopCompositingStar = () => {
  clearInterval(tryCompositeNextStarVideoFrameInterval);
  removeAndRewindVideo({ el: starVideoEl });
};

const setStarRgbWithoutComposite = (rgb) => {
  starCompositeParams.starRGB = rgb;
};

const setDustRgbWithoutComposite = (rgb) => {
  starCompositeParams.dustRGB = rgb;
};

const setStarRGB = (rgb) => {
  setStarRgbWithoutComposite(rgb);
  tryCompositeStar();
};

const setDustRGB = (rgb) => {
  setDustRgbWithoutComposite(rgb);
  tryCompositeStar();
};

const applyStarData = (starData) => {
  const {
    starColor, starShade, dustColor, dustShade,
  } = starData;
  // TODO: starShape and dustType should map to the blob URL
  // of the corresponding videos, whose canplaythrough events should be awaited
  // setVidSrc(blobs[blobFilenames.placeholderStarVid]);
  const { el } = videos.placeholderStarVid;
  el.load();
  starVideoEl = prepareVideo({
    el,
    className: 'hiddenVideo',
  });
  // document.body.appendChild(starVideoEl);
  setStarRgbWithoutComposite(colorShadeToRGB(starColor, starShade));
  setDustRgbWithoutComposite(colorShadeToRGB(dustColor, dustShade));
  clearInterval(tryCompositeNextStarVideoFrameInterval);
  tryCompositeNextStarVideoFrameInterval = (
    setIntervalWithInitialCall(tryCompositeNextStarVideoFrame, vidFrameDurationMs)
  );
};

let lastFinishedTime = Date.now();
let compositeFPS = '0fps';
const getCompositeFPS = () => compositeFPS;
const init = () => {
  // console.log('Initializing composite worker manager');
  // document.body.appendChild(starVideoEl);
  starCompositeWorker = new Worker(misc.compositeWorker.blob);
  starCompositeWorker.onmessage = ({ data }) => {
    const currentFinishedTime = Date.now();
    compositeFPS = `${Math.floor(1000 / (currentFinishedTime - lastFinishedTime))}fps`;
    lastFinishedTime = currentFinishedTime;
    starCompositeCtx.putImageData(data, 0, 0);
    const compositeWorkerWasQueued = starCompositeWorkerState === compositeWorkerStates.queued;
    starCompositeWorkerState = 0;
    if (compositeWorkerWasQueued) tryCompositeStar();
  };
};

// TODO: Setter for particle type (will impact video's negative Y draw offset on canvas)
module.exports = {
  init,
  stopCompositing: stopCompositingStar,
  starCompositeCanvas,
  setStarRGB,
  setDustRGB,
  applyStarData,
  getCompositeFPS,
};
