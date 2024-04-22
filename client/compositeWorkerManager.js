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
  misc: { compositeWorker: compositeWorkerSrc }, prepareVideo, removeAndRewindVideo, getEl, getBlob,
} = require('./preload.js');
const { starchetypes } = require('./starchetypes.js');

const compositeWorkerStates = {
  idle: 0,
  compositing: 1,
  queued: 2,
};

let compositeWorker;
let compositeWorkerState = compositeWorkerStates.idle;
let imageEls = [];
// let imageEl;
let videoEls = [];
let currentVideoEl;
let getImageDataTestsPending = 0;

const videoCanvas = document.createElement('canvas');
videoCanvas.width = vidWidth;
videoCanvas.height = vidHeight;
const videoCtx = videoCanvas.getContext('2d', { willReadFrequently: true });
// document.body.appendChild(videoCanvas);

const compositeCanvas = document.createElement('canvas');
compositeCanvas.width = vidPartWidth;
compositeCanvas.height = vidPartHeight;
const compositeCtx = compositeCanvas.getContext('2d');
// document.body.appendChild(compositeCanvas);

let tryCompositeNextVideoFrameInterval;

const compositeParams = {
  starRGB: [1, 0, 0],
  dustRGB: [0, 1, 0],
  basisBytes: new Uint8ClampedArray(bytesPerVidPart),
  starDiffBytes: new Uint8ClampedArray(bytesPerVidPart),
  dustDiffBytes: new Uint8ClampedArray(bytesPerVidPart),
  starTimesDustDiffBytes: new Uint8ClampedArray(bytesPerVidPart),
  alphaBytes: new Uint8ClampedArray(bytesPerVidPart),
};

const tryComposite = () => {
  if (compositeWorkerState === compositeWorkerStates.idle) {
    compositeWorkerState = compositeWorkerStates.compositing;
    compositeWorker.postMessage(compositeParams);
  } else {
    compositeWorkerState = compositeWorkerStates.queued;
  }
};

const tryCompositeNextVideoFrame = () => {
  // It seems cropping a larger video doesn't improve performance
  videoCtx.drawImage(currentVideoEl, 0, 0);

  const testingGetImageData = getImageDataTestsPending > 0;
  getImageDataTestsPending--;
  if (testingGetImageData) {
    console.log(`Attempting to getImageData... (${getImageDataTestsPending} test${getImageDataTestsPending === 1 ? '' : 's'} remaining)`);
  }
  Object.assign(compositeParams, {
    basisBytes: videoCtx.getImageData(...basisBounds).data,
    starDiffBytes: videoCtx.getImageData(...starDiffBounds).data,
    dustDiffBytes: videoCtx.getImageData(...dustDiffBounds).data,
    starTimesDustDiffBytes: videoCtx.getImageData(...starTimesDustDiffBounds).data,
    alphaBytes: videoCtx.getImageData(...alphaBounds).data,
  });
  if (testingGetImageData) {
    console.log('Succeeded!');
  }
  tryComposite();
};

const stopCompositing = () => {
  clearInterval(tryCompositeNextVideoFrameInterval);
  for (let i = 0; i < videoEls.length; i++) {
    removeAndRewindVideo({ el: videoEls[i] });
  }
};

const setStarRgbWithoutComposite = (rgb) => {
  compositeParams.starRGB = rgb;
};

const setDustRgbWithoutComposite = (rgb) => {
  compositeParams.dustRGB = rgb;
};

const setStarRGB = (rgb) => {
  setStarRgbWithoutComposite(rgb);
  tryComposite();
};

const setDustRGB = (rgb) => {
  setDustRgbWithoutComposite(rgb);
  tryComposite();
};

const setDustType = (dustType) => {
  console.log(`Setting dust type to ${dustType}. Drawing failsafe still image...`);
  // videoCtx.drawImage(imageEls[dustType], 0, 0);
  console.log('Succeeded!');
  currentVideoEl = videoEls[dustType];
  clearInterval(tryCompositeNextVideoFrameInterval);
  tryCompositeNextVideoFrameInterval = (
    setIntervalWithInitialCall(tryCompositeNextVideoFrame, vidFrameDurationMs)
  );
};

const applyStarData = (starData) => {
  console.log(`Applying star data: ${starData}`);
  const {
    shape, starColor, starShade, dustColor, dustShade, dustType,
  } = starData;
  const { dustTypeImages, dustTypeVideos } = starchetypes[shape];
  imageEls = dustTypeImages.map(getEl);
  videoEls = [];
  for (let i = 0; i < dustTypeVideos.length; i++) {
    const videoEl = prepareVideo({
      el: getEl(dustTypeVideos[i]),
      className: 'hiddenVideo',
    });
    console.log(`Initial draw of video ${i}...`);
    videoCtx.drawImage(videoEl, 0, 0); // Avoid "skip" I noticed on Firefox
    console.log('Succeeded!');
    videoEls[i] = videoEl;
  }
  videoCtx.clearRect(0, 0, vidWidth, vidHeight);
  // document.body.appendChild(starVideoEl);
  setStarRgbWithoutComposite(colorShadeToRGB(starColor, starShade));
  setDustRgbWithoutComposite(colorShadeToRGB(dustColor, dustShade));
  getImageDataTestsPending = 3;
  setDustType(dustType);
};

const init = () => {
  // console.log('Initializing composite worker manager');
  // document.body.appendChild(starVideoEl);
  compositeWorker = new Worker(getBlob(compositeWorkerSrc));
  compositeWorker.onmessage = ({ data }) => {
    compositeCtx.putImageData(data, 0, 0);
    const compositeWorkerWasQueued = compositeWorkerState === compositeWorkerStates.queued;
    compositeWorkerState = 0;
    if (compositeWorkerWasQueued) tryComposite();
  };
};

module.exports = {
  init,
  stopCompositing,
  compositeCanvas,
  setStarRGB,
  setDustRGB,
  setDustType,
  applyStarData,
};
