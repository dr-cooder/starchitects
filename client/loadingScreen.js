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
let loadingProgressOuter;
let loadingProgressInner;
let loadingStarPreviousHalfBrightRect = loadingStarInitialPreviousHalfBrightRect;
let loadingStarLoadingAnimInterval;

const resize = () => {
  if (!(loadingStar && loadingProgressOuter)) {
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
  loadingProgressOuter.style.left = px(horizontalOffset);
  loadingProgressOuter.style.top = px(
    verticalOffset + verticalFreeSpace / 2 + pixelsPerUnit * loadingProgressTopUnits,
  );
  loadingProgressOuter.style.width = px(pixelsPerUnit * unitsHorizontalInner);
  loadingProgressOuter.style.height = px(pixelsPerUnit * loadingProgressHeightUnits);
  loadingProgressOuter.style.fontSize = px(pixelsPerUnit * unitsPerEm);
};

const updateProgress = (message) => {
  if (message != null) loadingProgressInner.innerText = message;
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

const isBrowserTooOld = () => {
  const testElement = document.createElement('canvas');
  return !(testElement.inert !== undefined && testElement.getContext && testElement.getContext('2d'));
};

// TODO: https://www.androidpolice.com/vivaldis-latest-update-blocks-pesky-auto-playing-videos/
// This is a problem for video backgrounds and may not be easy to check -
// instead, check if the video is running after a second or so?
const isVivaldiVideoAutoplayBlocked = () => false;

window.onload = () => {
  loadingStar = document.querySelector('#loadingStar');
  loadingStarCenter = loadingStar.querySelector('#center');
  for (let i = 0; i < loadingStarRectCount; i++) {
    loadingStarRects[i] = loadingStar.querySelector(`#rect${i}`);
  }
  loadingProgressOuter = document.querySelector('#loadingProgressOuter');
  loadingProgressInner = document.querySelector('#loadingProgressInner');
  window.addEventListener('resize', resize);
  resize();
  if (isBrowserTooOld()) {
    darkenLoadingStar();
    updateProgress('Please update your web browser!');
  } else if (isVivaldiVideoAutoplayBlocked()) {
    darkenLoadingStar();
    updateProgress('Please enable video autoplay in Vivaldi\'s settings! ("V" logo in corner > Settings > WEB PAGES: Site Settings > Content: Autoplay Videos)');
  } else {
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
  }
};
