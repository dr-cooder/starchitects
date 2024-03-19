const {
  getGridMeasurements,
  unitsHorizontalInner,
  unitsHorizontalInnerHalf,
  unitsVerticalInnerHalf,
  unitsPerEm,
} = require('./measurements.js');
const {
  preload,
  allBlobsToDoc,
  assignBlobSrcsToFontsStylesScripts,
  fontsStylesScriptsToHead,
} = require('./preload.js');
const { px, percent } = require('../common/helpers.js');

const loadingStarWidth = 72;
const loadingStarHeight = 72;
const loadingStarBottomMargin = 16;
const loadingStarRectCount = 8;
const loadingStarInitialPreviousHalfBrightRect = 5;
const loadingStarFrameDuration = 125;
const loadingStarDark = 0.25;
const loadingStarHalfBright = 0.5;
const loadingStarFullBright = 1;

const loadingStarWidthHalf = loadingStarWidth / 2;
const loadingStarHeightHalf = loadingStarHeight / 2;
const loadingStarLeftUnits = unitsHorizontalInnerHalf - loadingStarWidthHalf;
const loadingStarTopUnits = unitsVerticalInnerHalf - loadingStarHeightHalf;
const loadingStarHeightHalfWithMargin = loadingStarHeightHalf + loadingStarBottomMargin;
const loadingProgressTopUnits = unitsVerticalInnerHalf + loadingStarHeightHalfWithMargin;
const loadingProgressHeightUnits = unitsVerticalInnerHalf - loadingStarHeightHalfWithMargin;

// TODO: Have main script remove these elements once the root has faded in fully
let loadingStar;
let loadingStarCenter;
const loadingStarRects = [];
let loadingStarIsPlayingLoadingAnim = false;
let loadingProgress;

const resize = () => {
  if (!loadingStar || !loadingProgress) {
    window.removeEventListener('resize', resize);
  }
  const {
    pixelsPerUnit, verticalFreeSpace, horizontalOffset, verticalOffset,
  } = getGridMeasurements();
  loadingStar.style.left = px(horizontalOffset + pixelsPerUnit * loadingStarLeftUnits);
  loadingStar.style.top = px(
    verticalOffset + verticalFreeSpace / 2 + pixelsPerUnit * loadingStarTopUnits,
  );
  loadingStar.style.width = px(pixelsPerUnit * loadingStarWidth);
  loadingStar.style.height = px(pixelsPerUnit * loadingStarHeight);
  loadingProgress.style.left = px(horizontalOffset);
  loadingProgress.style.top = px(
    verticalOffset + verticalFreeSpace / 2 + pixelsPerUnit * loadingProgressTopUnits,
  );
  loadingProgress.style.width = px(pixelsPerUnit * unitsHorizontalInner);
  loadingProgress.style.height = px(pixelsPerUnit * loadingProgressHeightUnits);
  loadingProgress.style.fontSize = px(pixelsPerUnit * unitsPerEm);
};

const updateProgress = (message) => {
  if (message != null) loadingProgress.innerText = message;
};

const setSvgElementOpacity = (element, opacity) => {
  element.setAttribute('opacity', opacity);
};

const setAllLoadingStarRectsOpacity = (opacity) => {
  for (let i = 0; i < loadingStarRectCount; i++) {
    setSvgElementOpacity(loadingStarRects[i], opacity);
  }
};

const displayLoadingStarLoadingAnimFrame = (previousHalfBrightRect) => {
  if (loadingStarIsPlayingLoadingAnim) {
    const halfBrightRect = (previousHalfBrightRect + 1) % loadingStarRectCount;
    const fullBrightRect = (previousHalfBrightRect + 2) % loadingStarRectCount;
    setSvgElementOpacity(loadingStarRects[previousHalfBrightRect], loadingStarDark);
    setSvgElementOpacity(loadingStarRects[halfBrightRect], loadingStarHalfBright);
    setSvgElementOpacity(loadingStarRects[fullBrightRect], loadingStarFullBright);
    setTimeout(() => displayLoadingStarLoadingAnimFrame(halfBrightRect), loadingStarFrameDuration);
  }
};

const playLoadingStarLoadingAnim = () => {
  loadingStarIsPlayingLoadingAnim = true;
  setSvgElementOpacity(loadingStarCenter, loadingStarFullBright);
  setAllLoadingStarRectsOpacity(loadingStarDark);
  displayLoadingStarLoadingAnimFrame(loadingStarInitialPreviousHalfBrightRect);
};

const brightenLoadingStar = () => {
  loadingStarIsPlayingLoadingAnim = false;
  setSvgElementOpacity(loadingStarCenter, loadingStarFullBright);
  setAllLoadingStarRectsOpacity(loadingStarFullBright);
};

const darkenLoadingStar = () => {
  loadingStarIsPlayingLoadingAnim = false;
  setSvgElementOpacity(loadingStarCenter, loadingStarDark);
  setAllLoadingStarRectsOpacity(loadingStarDark);
};

window.onload = () => {
  loadingStar = document.querySelector('#loadingStar');
  loadingStarCenter = loadingStar.querySelector('#center');
  for (let i = 0; i < loadingStarRectCount; i++) {
    loadingStarRects[i] = loadingStar.querySelector(`#rect${i}`);
  }
  loadingProgress = document.querySelector('#loadingProgress');
  window.addEventListener('resize', resize);
  resize();
  let loadNotFailedYet = true;
  playLoadingStarLoadingAnim();
  preload((progress) => {
    if (loadNotFailedYet && progress != null) updateProgress(percent(progress));
  }).then((allBlobs) => {
    brightenLoadingStar();
    updateProgress(percent(100));
    allBlobsToDoc(allBlobs);
    assignBlobSrcsToFontsStylesScripts(allBlobs);
    fontsStylesScriptsToHead();
  }).catch((errorMsg) => {
    loadNotFailedYet = false;
    darkenLoadingStar();
    updateProgress(errorMsg ?? 'Failed to load');
  });
};

// TODO: Ensure browser has canvas support (even though techincally a browser that
// can't run React will almost certainly not be able to use canvas either?)
// TODO: Ensure that, if the browser has canvas support, it can also render a video in canvas
// (if it can't, use a still?)
