const {
  bytesPerVidPart,
  vidPartWidth,
  vidPartHeight,
  vidWidth,
  vidHeight,
  vidFrameDurationMs,
  albedoBounds,
  shadingBounds,
  specularBounds,
  grayscalesBounds,
} = require('../common/compositing.js');
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
  color: 0,
  shade: 0,
  albedoBytes: new Uint8ClampedArray(bytesPerVidPart),
  shadingBytes: new Uint8ClampedArray(bytesPerVidPart),
  specularBytes: new Uint8ClampedArray(bytesPerVidPart),
  grayscalesBytes: new Uint8ClampedArray(bytesPerVidPart),
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
    albedoBytes: vidCtx.getImageData(...albedoBounds).data,
    shadingBytes: vidCtx.getImageData(...shadingBounds).data,
    specularBytes: vidCtx.getImageData(...specularBounds).data,
    grayscalesBytes: vidCtx.getImageData(...grayscalesBounds).data,
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
  vid.src = null;
};

const getColor = () => compositeParams.color;

const setColor = (color) => {
  compositeParams.color = color ?? 0;
  tryComposite();
};

const getShade = () => compositeParams.shade;

const setShade = (shade) => {
  compositeParams.shade = shade ?? 0;
  tryComposite();
};

const applyStarData = (starData) => {
  const { color, shade } = starData;
  // TODO: starData.shape should map to the blob URL
  // of the corresponding video once they are all present
  setVidSrc(blobs[blobFilenames.placeholderStarVid]);
  setColor(color);
  setShade(shade);
};

const init = () => {
  console.log('Initializing composite worker manager');
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
  init, setVidSrc, stopVid, compositeCanvas, getColor, setColor, getShade, setShade, applyStarData,
};
