const {
  getGridMeasurements,
  unitsHorizontalInner,
  unitsHorizontalInnerHalf,
  unitsVerticalInnerHalf,
  unitsPerEm,
} = require('./measurements.js');
const {
  preload,
  preloadInfoToDoc,
  assignPreloadInfoToFontsStylesScripts,
  fontsStylesScriptsToHead,
} = require('./preload.js');
const { px, percent, setIntervalWithInitialCall } = require('../common/helpers.js');

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

let loadingStar;
let loadingStarCenter;
const loadingStarRects = [];
let loadingProgress;
let loadingStarPreviousHalfBrightRect = loadingStarInitialPreviousHalfBrightRect;
let loadingStarLoadingAnimInterval;

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

const displayLoadingStarLoadingAnimFrame = () => {
  const halfBrightRect = (loadingStarPreviousHalfBrightRect + 1) % loadingStarRectCount;
  const fullBrightRect = (loadingStarPreviousHalfBrightRect + 2) % loadingStarRectCount;
  setSvgElementOpacity(loadingStarRects[loadingStarPreviousHalfBrightRect], loadingStarDark);
  setSvgElementOpacity(loadingStarRects[halfBrightRect], loadingStarHalfBright);
  setSvgElementOpacity(loadingStarRects[fullBrightRect], loadingStarFullBright);
  loadingStarPreviousHalfBrightRect = halfBrightRect;
};

const stopLoadingStarLoadingAnim = () => {
  loadingStarPreviousHalfBrightRect = loadingStarInitialPreviousHalfBrightRect;
  clearInterval(loadingStarLoadingAnimInterval);
};

const playLoadingStarLoadingAnim = () => {
  setSvgElementOpacity(loadingStarCenter, loadingStarFullBright);
  setAllLoadingStarRectsOpacity(loadingStarDark);
  stopLoadingStarLoadingAnim();
  loadingStarLoadingAnimInterval = (
    setIntervalWithInitialCall(displayLoadingStarLoadingAnimFrame, loadingStarFrameDuration)
  );
};

const brightenLoadingStar = () => {
  stopLoadingStarLoadingAnim();
  setSvgElementOpacity(loadingStarCenter, loadingStarFullBright);
  setAllLoadingStarRectsOpacity(loadingStarFullBright);
};

const darkenLoadingStar = () => {
  stopLoadingStarLoadingAnim();
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
    if (loadNotFailedYet && progress != null) updateProgress(percent(progress, true));
  }).then((preloadInfo) => {
    brightenLoadingStar();
    updateProgress(percent(100));
    preloadInfoToDoc(preloadInfo);
    assignPreloadInfoToFontsStylesScripts(preloadInfo);
    fontsStylesScriptsToHead();
  }).catch((errorMsg) => {
    loadNotFailedYet = false;
    darkenLoadingStar();
    updateProgress(errorMsg ?? 'Failed to load');
  });
};

// TODO: Ensure browser has support for the following:
// - CSS Animations (Opera Mini: https://caniuse.com/css-animation)
//   - Refuse to start - "Please try a different web browser!"
// - Canvas
//   - Refuse to start
// - Rendering videos with Canvas (Firefox Android: https://bugzilla.mozilla.org/show_bug.cgi?id=1526207))
//   - Instead of checking, we could just draw a static image to the canvas
//     before starting the video draw loop, as a failsafe
// - Video autoplay (Vivaldi Android: https://www.androidpolice.com/vivaldis-latest-update-blocks-pesky-auto-playing-videos/)
//   - This is a problem for video backgrounds and may not be easy to check - instead,
//     check if the video is running after a second or so, and if not,
//     manually call onEnd after a timeout
