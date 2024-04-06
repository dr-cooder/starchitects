const { dictToElement } = require('../common/helpers.js');

// ~~~ INFO OF ITEMS TO PRELOAD, SOME STATEFUL ~~~

const fonts = [
  {
    url: '/fonts/Geist-Regular.otf',
    family: 'Geist',
    weight: 400,
  },
  {
    url: '/fonts/Geist-Medium.otf',
    family: 'Geist',
    weight: 500,
  },
  {
    url: '/fonts/Geist-Bold.otf',
    family: 'Geist',
    weight: 700,
  },
  {
    url: '/fonts/Migra-Regular.otf',
    family: 'Migra',
    weight: 400,
  },
];

const styles = [
  {
    url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap-reboot.min.css',
    integrity: 'sha384-AzXcmcMInlJeZ/nwA+GR1Ta94m/H/FK4P6NcvXCVMWbzM4WyU+i1JgunGXPetEyz',
    crossorigin: 'anonymous',
  },
  {
    url: '/style.css',
  },
  {
    url: '/animations.css',
  },
];

const scripts = [
  {
    url: '/main.js',
  },
];

// Ask server for prefix to video URL's - server should return cloud URL if on Heroku
// and gitignored video folder otherwise
const videos = {
  placeholderStarVid: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'composite/placeholder/1.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'composite/placeholder/1.mp4',
      },
    ],
  },
  quizBg1Start: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'background/quiz/test-start.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'background/quiz/test-start.mp4',
      },
    ],
  },
  quizBg1Loop: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'background/quiz/test-loop.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'background/quiz/test-loop.mp4',
      },
    ],
  },
  quizBg2Start: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'background/quiz/test-loop.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'background/quiz/test-loop.mp4',
      },
    ],
  },
  quizBg2Loop: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'background/quiz/test-loop.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'background/quiz/test-loop.mp4',
      },
    ],
  },
  quizBg3Start: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'background/quiz/test-loop.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'background/quiz/test-loop.mp4',
      },
    ],
  },
  quizBg3Loop: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'background/quiz/test-loop.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'background/quiz/test-loop.mp4',
      },
    ],
  },
  quizBg4Start: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'background/quiz/test-loop.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'background/quiz/test-loop.mp4',
      },
    ],
  },
  quizBg4Loop: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'background/quiz/test-loop.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'background/quiz/test-loop.mp4',
      },
    ],
  },
  quizBg5Start: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'background/quiz/test-loop.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'background/quiz/test-loop.mp4',
      },
    ],
  },
  quizBg5Loop: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'background/quiz/test-loop.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'background/quiz/test-loop.mp4',
      },
    ],
  },
  quizBgEnd: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'background/quiz/test-loop.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'background/quiz/test-loop.mp4',
      },
    ],
  },
};

const misc = {
  backgroundImg: {
    url: '/images/background.png',
  },
  compositeWorker: {
    url: '/composite-worker.js',
  },
  logo: {
    url: '/images/logo.svg',
  },
  progressStar: {
    url: '/images/progress-star.svg',
  },
};

const getURL = (item) => item.url;
const fontURLs = fonts.map(getURL);
const styleURLs = styles.map(getURL);
const scriptURLs = scripts.map(getURL);
const videoValues = Object.values(videos);
const videoSourcesFlat = videoValues.map((video) => video.sources).flat();
const miscValues = Object.values(misc);
const miscURLs = miscValues.map(getURL);

// ~~~ MOVING DATA BETWEEN DOCUMENT AND STATE ~~~

const preloadInfoToDoc = (preloadInfo) => {
  document.head.dataset.preloadInfo = JSON.stringify(preloadInfo);
};

const preloadInfoFromDoc = () => {
  const preloadInfo = JSON.parse(document.head.dataset.preloadInfo);
  delete document.head.dataset.preloadInfo;
  return preloadInfo;
};

const assignBlobs = (blobs, items) => {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    item.blob = blobs[getURL(item)];
  }
};

const assignVideoFolder = (videoFolder) => {
  for (let i = 0; i < videoSourcesFlat.length; i++) {
    const videoSource = videoSourcesFlat[i];
    videoSource.url = videoFolder + videoSource.urlRel;
  }
};

const assignPreloadInfoToFontsStylesScripts = (preloadInfo) => {
  const { blobs } = preloadInfo;
  assignBlobs(blobs, fonts);
  assignBlobs(blobs, styles);
  assignBlobs(blobs, scripts);
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

const assignPreloadInfoToVideosMisc = (preloadInfo) => {
  const { blobs, videoFolder } = preloadInfo;
  assignVideoFolder(videoFolder);
  // assignBlobs(blobs, videoSourcesFlat);
  assignBlobs(blobs, miscValues);
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
    videoEl.crossOrigin = 'Anonymous';
    videoEl.setAttribute('webkit-playsinline', 'webkit-playsinline');
    videoEl.setAttribute('playsinline', 'playsinline');
    videoEl.setAttribute('preload', 'auto');
    videoEl.className = 'hiddenVideo';
    for (let j = 0; j < sources.length; j++) {
      const source = sources[j];
      const sourceEl = document.createElement('source');
      sourceEl.type = source.type;
      sourceEl.src = getURL(source);
      videoEl.appendChild(sourceEl);
    }
    video.el = videoEl;
    mediaBench.appendChild(videoEl);
    // videoEl.load();
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

const hideAndRewindVideo = (props) => {
  const { el } = props;
  el.className = 'hiddenVideo';
  el.pause();
  // Bit of a hacky anti-flicker measure that assumes the no element
  // will be re-appended within a split second of its removal
  setTimeout(() => { el.currentTime = 0; }, 100);
};

const removeAndRewindVideo = (props) => {
  hideAndRewindVideo(props);
  mediaBench.appendChild(props.el);
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
  const stopPreloadingAndReject = () => {
    preloading = false;
    reject();
  };
  fetch('/video-folder').then((res) => res.text().then((videoFolder) => {
    // assignVideoFolder(videoFolder);
    const allURLs = [...new Set([
      ...fontURLs,
      ...styleURLs,
      ...scriptURLs,
      // ...videoSourceURLs, // Apparently Safari doesn't like videos with blob sources,
      // but loading them this way anyway will hopefully cache them
      // https://discussions.apple.com/thread/254893296?sortBy=best
      ...miscURLs,
    ])];
    const progresses = Object.assign({}, ...allURLs.map((url) => ({ [url]: {} })));
    Promise.all(allURLs.map((url) => loadBlob({
      url,
      onProgress: (e) => {
        progresses[url] = e;
        onProgress(getTotalProgress(Object.values(progresses)));
      },
    }))).then((preloadInfoList) => {
      preloading = false;
      resolve({
        blobs: Object.assign(
          {},
          ...allURLs.map((url, index) => ({
            [url]: preloadInfoList[index],
          })),
        ),
        videoFolder,
      });
    }).catch(stopPreloadingAndReject);
  }).catch(stopPreloadingAndReject)).catch(stopPreloadingAndReject);
}));

module.exports = {
  preload,
  preloadInfoToDoc,
  preloadInfoFromDoc,
  assignPreloadInfoToFontsStylesScripts,
  fontsStylesScriptsToHead,
  assignPreloadInfoToVideosMisc,
  createImageVideoEls,
  prepareVideo,
  hideAndRewindVideo,
  removeAndRewindVideo,
  videos,
  misc,
};
