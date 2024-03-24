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
const { blobs, blobFilenames } = require('./preload.js');

let compositeWorker;

const compositeWorkerStates = {
  idle: 0,
  compositing: 1,
  queued: 2,
};
let compositeWorkerState = compositeWorkerStates.idle;

const vid = document.createElement('video');
vid.className = 'hiddenVideo';
vid.muted = true;
vid.loop = true;
vid.autoplay = true;
vid.oncanplaythrough = vid.play;

const vidCanvas = document.createElement('canvas');
vidCanvas.width = vidWidth;
vidCanvas.height = vidHeight;
const vidCtx = vidCanvas.getContext('2d');

const compositeCanvas = document.createElement('canvas');
compositeCanvas.width = vidPartWidth;
compositeCanvas.height = vidPartHeight;
const compositeCtx = compositeCanvas.getContext('2d');

let noActiveVid = true;

const compositeParams = {
  rgb: [1, 0, 0],
  blackBytes: new Uint8ClampedArray(bytesPerVidPart),
  bwDiffBytes: new Uint8ClampedArray(bytesPerVidPart),
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
  if (noActiveVid) return;

  setTimeout(() => tryCompositeNextVideoFrame(), vidFrameDurationMs);

  vidCtx.drawImage(vid, 0, 0);

  Object.assign(compositeParams, {
    blackBytes: vidCtx.getImageData(...blackBounds).data,
    bwDiffBytes: vidCtx.getImageData(...bwDiffBounds).data,
    alphaBytes: vidCtx.getImageData(...alphaBounds).data,
  });
  tryComposite();
};

const setVidSrc = (src) => {
  vid.src = src;
  noActiveVid = false;
  tryCompositeNextVideoFrame();
};

const stopVid = () => {
  noActiveVid = true;
  vid.removeAttribute('src');
};

const setStarRGB = (rgb) => {
  compositeParams.rgb = rgb;
  tryComposite();
};

const applyStarData = (starData) => {
  const { starColor, starShade } = starData;
  // TODO: starShape and dustType should map to the blob URL
  // of the corresponding video
  setVidSrc(blobs[blobFilenames.placeholderStarVid]);
  setStarRGB(colorShadeToRGB(starColor, starShade));
};

const init = () => {
  // console.log('Initializing composite worker manager');
  document.body.appendChild(vid);
  compositeWorker = new Worker(blobs[blobFilenames.compositeWorker]);
  compositeWorker.onmessage = ({ data }) => {
    compositeCtx.putImageData(data, 0, 0);
    const compositeWorkerWasQueued = compositeWorkerState === compositeWorkerStates.queued;
    compositeWorkerState = 0;
    if (compositeWorkerWasQueued) tryComposite();
  };
};

module.exports = {
  init, setVidSrc, stopVid, compositeCanvas, setStarRGB, applyStarData,
};
