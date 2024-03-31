const {
  bytesPerVidPart,
  vidPartWidth,
  vidPartHeight,
  vidWidth,
  vidHeight,
  vidFrameDurationMs,
  blackBounds,
  bwDiffBounds,
  alphaBounds,
} = require('../common/compositing.js');
const { colorShadeToRGB } = require('../common/helpers.js');
const {
  videos, misc, prepareVideo, removeAndRewindVideo,
} = require('./preload.js');

const compositeWorkerStates = {
  idle: 0,
  compositing: 1,
  queued: 2,
};

// TODO: Repeat everything below for stardust

let starCompositeWorker;
let starCompositeWorkerState = compositeWorkerStates.idle;
let starVideoEl;

const starVideoCanvas = document.createElement('canvas');
starVideoCanvas.width = vidWidth;
starVideoCanvas.height = vidHeight;
const starVideoCtx = starVideoCanvas.getContext('2d');

const starCompositeCanvas = document.createElement('canvas');
starCompositeCanvas.width = vidPartWidth;
starCompositeCanvas.height = vidPartHeight;
const starCompositeCtx = starCompositeCanvas.getContext('2d');

let noActiveStarVideo = true;

const starCompositeParams = {
  rgb: [1, 0, 0],
  blackBytes: new Uint8ClampedArray(bytesPerVidPart),
  bwDiffBytes: new Uint8ClampedArray(bytesPerVidPart),
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
  if (noActiveStarVideo) return;

  setTimeout(() => tryCompositeNextStarVideoFrame(), vidFrameDurationMs);

  starVideoCtx.drawImage(starVideoEl, 0, 0);

  Object.assign(starCompositeParams, {
    blackBytes: starVideoCtx.getImageData(...blackBounds).data,
    bwDiffBytes: starVideoCtx.getImageData(...bwDiffBounds).data,
    alphaBytes: starVideoCtx.getImageData(...alphaBounds).data,
  });
  tryCompositeStar();
};

// const setVidSrc = (src) => {
//   starVideoEl.src = src;
//   noActiveStarVideo = false;
//   tryCompositeNextStarVideoFrame();
// };

const stopCompositingStar = () => {
  noActiveStarVideo = true;
  removeAndRewindVideo({ el: starVideoEl });
};

const setStarRgbWithoutComposite = (rgb) => {
  starCompositeParams.rgb = rgb;
};

const setStarRGB = (rgb) => {
  setStarRgbWithoutComposite(rgb);
  tryCompositeStar();
};

const applyStarData = (starData) => {
  const { starColor, starShade } = starData;
  // TODO: starShape and dustType should map to the blob URL
  // of the corresponding video
  // setVidSrc(blobs[blobFilenames.placeholderStarVid]);
  starVideoEl = prepareVideo({
    el: videos.placeholderStarVid.el,
    className: 'hiddenVideo',
  });
  document.body.appendChild(starVideoEl);
  noActiveStarVideo = false;
  setStarRgbWithoutComposite(colorShadeToRGB(starColor, starShade));
  tryCompositeNextStarVideoFrame();
};

const init = () => {
  // console.log('Initializing composite worker manager');
  // document.body.appendChild(starVideoEl);
  starCompositeWorker = new Worker(misc.compositeWorker.blob);
  starCompositeWorker.onmessage = ({ data }) => {
    starCompositeCtx.putImageData(data, 0, 0);
    const compositeWorkerWasQueued = starCompositeWorkerState === compositeWorkerStates.queued;
    starCompositeWorkerState = 0;
    if (compositeWorkerWasQueued) tryCompositeStar();
  };
};

module.exports = {
  init,
  stopCompositing: stopCompositingStar,
  starCompositeCanvas,
  setStarRGB,
  applyStarData,
};
