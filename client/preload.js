const { dictToElement } = require('../common/helpers.js');

// ~~~ INFO OF ITEMS TO PRELOAD, SOME STATEFUL ~~~

const fonts = [
  {
    filename: '/fonts/Geist-Regular.otf',
    family: 'Geist',
    weight: 400,
  },
  {
    filename: '/fonts/Geist-Medium.otf',
    family: 'Geist',
    weight: 500,
  },
  {
    filename: '/fonts/Geist-Bold.otf',
    family: 'Geist',
    weight: 700,
  },
  {
    filename: '/fonts/Migra-Regular.otf',
    family: 'Migra',
    weight: 400,
  },
];

const styles = [
  {
    filename: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap-reboot.min.css',
    integrity: 'sha384-AzXcmcMInlJeZ/nwA+GR1Ta94m/H/FK4P6NcvXCVMWbzM4WyU+i1JgunGXPetEyz',
    crossorigin: 'anonymous',
  },
  {
    filename: '/style.css',
  },
  {
    filename: '/animations.css',
  },
];

const scripts = [
  {
    filename: '/main.js',
  },
];

const videos = {
  placeholderStarVid: {
    sources: [
      {
        type: 'video/mp4',
        filename: '/videos/composite/placeholder.mp4',
      },
    ],
  },
  quizBgTestStart: {
    sources: [
      {
        type: 'video/webm',
        filename: '/videos/background/quiz/test-start.webm',
      },
      {
        type: 'video/mp4',
        filename: '/videos/background/quiz/test-start.mp4',
      },
    ],
  },
  quizBgTestLoop: {
    sources: [
      {
        type: 'video/webm',
        filename: '/videos/background/quiz/test-loop.webm',
      },
      {
        type: 'video/mp4',
        filename: '/videos/background/quiz/test-loop.mp4',
      },
    ],
  },
};

const misc = {
  backgroundImg: {
    filename: '/images/background.png',
  },
  compositeWorker: {
    filename: '/composite-worker.js',
  },
  logo: {
    filename: '/images/logo.svg',
  },
  progressStar: {
    filename: '/images/progress-star.svg',
  },
};

const getFilename = (item) => item.filename;
const fontFilenames = fonts.map(getFilename);
const styleFilenames = styles.map(getFilename);
const scriptFilenames = scripts.map(getFilename);
const videoValues = Object.values(videos);
const videoSourcesFlat = videoValues.map((video) => video.sources).flat();
const videoSourceFilenames = videoSourcesFlat.map(getFilename);
const miscValues = Object.values(misc);
const miscFilenames = miscValues.map(getFilename);

// ~~~ MOVING DATA BETWEEN DOCUMENT AND STATE ~~~

const allBlobsToDoc = (allBlobs) => {
  document.head.dataset.allBlobs = JSON.stringify(allBlobs);
};

const allBlobsFromDoc = () => {
  const allBlobs = JSON.parse(document.head.dataset.allBlobs);
  delete document.head.dataset.allBlobs;
  return allBlobs;
};

const assignBlobs = (allBlobs, items) => {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    item.blob = allBlobs[item.filename];
  }
};

const assignBlobSrcsToFontsStylesScripts = (allBlobs) => {
  assignBlobs(allBlobs, fonts);
  assignBlobs(allBlobs, styles);
  assignBlobs(allBlobs, scripts);
};

const fontsStylesScriptsToHead = () => {
  const fontStyleElement = document.createElement('style');
  fontStyleElement.innerHTML = fonts.map((font) => `@font-face{font-family:${font.family};font-weight:${font.weight};src:url('${font.blob}')}`).join('');
  const headElements = [
    fontStyleElement,
    ...styles.map((style) => dictToElement(
      'link',
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: style.blob,
        integrity: style.integrity,
        crossorigin: style.crossorigin,
      },
    )),
    ...scripts.map((script) => dictToElement(
      'script',
      {
        src: script.blob,
      },
    )),
  ];
  for (let i = 0; i < headElements.length; i++) {
    document.head.appendChild(headElements[i]);
  }
};

const assignBlobsToVideosMisc = (allBlobs) => {
  // assignBlobs(allBlobs, videoSourcesFlat);
  assignBlobs(allBlobs, miscValues);
};

// In-DOM 'bench' exists so that all videos exist in the DOM from the get-go
// and still do so one "removed", a further anti-flicker measure
let mediaBench;

// No video (or canvas image) will ever need to be in more than one place at any given point
// during the runtime of this app, so avoid the memory impact and individual load lag of a new
// video element every time that video is called for, and instead give each a designated,
// reusable DOM node
const createImageVideoEls = () => {
  mediaBench = document.createElement('div');
  document.body.appendChild(mediaBench);
  for (let i = 0; i < videoValues.length; i++) {
    const video = videoValues[i];
    const { sources } = video;
    const videoEl = document.createElement('video');
    videoEl.muted = true;
    videoEl.crossOrigin = 'anonymous';
    videoEl.setAttribute('webkit-playsinline', 'webkit-playsinline');
    videoEl.setAttribute('playsinline', 'playsinline');
    videoEl.setAttribute('preload', 'auto');
    videoEl.className = 'hiddenVideo';
    for (let j = 0; j < sources.length; j++) {
      const source = sources[j];
      const sourceEl = document.createElement('source');
      sourceEl.type = source.type;
      sourceEl.src = source.filename;
      videoEl.appendChild(sourceEl);
    }
    video.el = videoEl;
    mediaBench.appendChild(videoEl);
    // videoEl.play();
    // videoEl.pause();
  }
};

const prepareVideo = (props) => {
  const { el, className, onEnd } = props;
  el.className = className;
  el.onended = onEnd;
  el.loop = !onEnd;
  // el.currentTime = 0;
  el.play();
  return el;
};

const removeAndRewindVideo = (props) => {
  const { el } = props;
  el.className = 'hiddenVideo';
  // el.remove();
  mediaBench.appendChild(el);
  el.pause();
  el.currentTime = 0;
};

// ~~~ LOAD BEHAVIOR ~~~

// https://dinbror.dk/blog/how-to-preload-entire-html5-video-before-play-solved/
// https://stackoverflow.com/questions/14218607/javascript-loading-progress-of-an-image
const loadBlob = ({ url, onProgress }) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';
  xhr.onload = () => {
    if (xhr.status === 200) {
      resolve(URL.createObjectURL(xhr.response));
    } else {
      reject(xhr.statusText);
    }
  };
  xhr.onprogress = onProgress;
  xhr.onerror = reject;
  xhr.send();
});

const getTotalProgress = (progressList) => {
  let loadedTotal = 0;
  let totalTotal = 0;
  for (let i = 0; i < progressList.length; i++) {
    const { loaded, total } = progressList[i];
    if (loaded == null || total == null) {
      return undefined;
    }
    loadedTotal += loaded;
    totalTotal += total;
  }
  return (loadedTotal / totalTotal) * 100;
};

let preloading = false;
const preload = (onProgress) => (preloading ? null : new Promise((resolve, reject) => {
  preloading = true;
  const allFilenames = [...new Set([
    ...fontFilenames,
    ...styleFilenames,
    ...scriptFilenames,
    // ...videoSourceFilenames, // Apparently Safari doesn't like videos with blob sources
    ...miscFilenames,
  ])];
  const progresses = Object.assign({}, ...allFilenames.map((filename) => ({ [filename]: {} })));
  Promise.all(allFilenames.map((filename) => loadBlob({
    url: filename,
    onProgress: (e) => {
      progresses[filename] = e;
      onProgress(getTotalProgress(Object.values(progresses)));
    },
  }))).then((allBlobsList) => {
    resolve(Object.assign(
      {},
      ...allFilenames.map((filename, index) => ({
        [filename]: allBlobsList[index],
      })),
    ));
  }).catch(() => {
    preloading = false;
    reject();
  });
}));

module.exports = {
  preload,
  allBlobsToDoc,
  allBlobsFromDoc,
  assignBlobSrcsToFontsStylesScripts,
  fontsStylesScriptsToHead,
  assignBlobsToVideosMisc,
  createImageVideoEls,
  prepareVideo,
  removeAndRewindVideo,
  videos,
  misc,
};
