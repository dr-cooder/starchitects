const { dictToElement, setTimeoutBetter } = require('../common/helpers.js');

// ~~~ INFO OF ITEMS TO PRELOAD, LOAD RESULTS BEING STATEFUL ~~~

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
    url: '/bootstrap-reboot.min.css',
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

// TODO: Geode/Innovator renders, alongside dust variations for all
const images = {
  thinker1: {
    urlRel: 'composite/chess/0.jpg',
  },
  thinker2: {
    urlRel: 'composite/chess/0.jpg',
  },
  thinker3: {
    urlRel: 'composite/chess/0.jpg',
  },
  dreamer1: {
    urlRel: 'composite/balloon/0.jpg',
  },
  dreamer2: {
    urlRel: 'composite/balloon/0.jpg',
  },
  dreamer3: {
    urlRel: 'composite/balloon/0.jpg',
  },
  producer1: {
    urlRel: 'composite/appliance/0.jpg',
  },
  producer2: {
    urlRel: 'composite/appliance/0.jpg',
  },
  producer3: {
    urlRel: 'composite/appliance/0.jpg',
  },
  disciplined1: {
    urlRel: 'composite/bonsai/0.jpg',
  },
  disciplined2: {
    urlRel: 'composite/bonsai/0.jpg',
  },
  disciplined3: {
    urlRel: 'composite/bonsai/0.jpg',
  },
  innovator1: {
    urlRel: 'composite/appliance/0.jpg',
  },
  innovator2: {
    urlRel: 'composite/appliance/0.jpg',
  },
  innovator3: {
    urlRel: 'composite/appliance/0.jpg',
  },
  visionary1: {
    urlRel: 'composite/duck/0.jpg',
  },
  visionary2: {
    urlRel: 'composite/duck/0.jpg',
  },
  visionary3: {
    urlRel: 'composite/duck/0.jpg',
  },
  independent1: {
    urlRel: 'composite/plane/0.jpg',
  },
  independent2: {
    urlRel: 'composite/plane/0.jpg',
  },
  independent3: {
    urlRel: 'composite/plane/0.jpg',
  },
  listener1: {
    urlRel: 'composite/radio/0.jpg',
  },
  listener2: {
    urlRel: 'composite/radio/0.jpg',
  },
  listener3: {
    urlRel: 'composite/radio/0.jpg',
  },
};

// Ask server for prefix to video URL's - server should return cloud URL if on Heroku
// and gitignored local video folder otherwise
const videos = {
  thinker1: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'composite/chess/0.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'composite/chess/0.mp4',
      },
    ],
  },
  thinker2: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'composite/chess/0.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'composite/chess/0.mp4',
      },
    ],
  },
  thinker3: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'composite/chess/0.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'composite/chess/0.mp4',
      },
    ],
  },
  dreamer1: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'composite/balloon/0.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'composite/balloon/0.mp4',
      },
    ],
  },
  dreamer2: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'composite/balloon/0.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'composite/balloon/0.mp4',
      },
    ],
  },
  dreamer3: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'composite/balloon/0.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'composite/balloon/0.mp4',
      },
    ],
  },
  producer1: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'composite/appliance/0.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'composite/appliance/0.mp4',
      },
    ],
  },
  producer2: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'composite/appliance/0.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'composite/appliance/0.mp4',
      },
    ],
  },
  producer3: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'composite/appliance/0.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'composite/appliance/0.mp4',
      },
    ],
  },
  disciplined1: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'composite/bonsai/0.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'composite/bonsai/0.mp4',
      },
    ],
  },
  disciplined2: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'composite/bonsai/0.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'composite/bonsai/0.mp4',
      },
    ],
  },
  disciplined3: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'composite/bonsai/0.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'composite/bonsai/0.mp4',
      },
    ],
  },
  innovator1: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'composite/appliance/0.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'composite/appliance/0.mp4',
      },
    ],
  },
  innovator2: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'composite/appliance/0.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'composite/appliance/0.mp4',
      },
    ],
  },
  innovator3: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'composite/appliance/0.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'composite/appliance/0.mp4',
      },
    ],
  },
  visionary1: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'composite/duck/0.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'composite/duck/0.mp4',
      },
    ],
  },
  visionary2: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'composite/duck/0.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'composite/duck/0.mp4',
      },
    ],
  },
  visionary3: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'composite/duck/0.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'composite/duck/0.mp4',
      },
    ],
  },
  independent1: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'composite/plane/0.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'composite/plane/0.mp4',
      },
    ],
  },
  independent2: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'composite/plane/0.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'composite/plane/0.mp4',
      },
    ],
  },
  independent3: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'composite/plane/0.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'composite/plane/0.mp4',
      },
    ],
  },
  listener1: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'composite/radio/0.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'composite/radio/0.mp4',
      },
    ],
  },
  listener2: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'composite/radio/0.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'composite/radio/0.mp4',
      },
    ],
  },
  listener3: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'composite/radio/0.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'composite/radio/0.mp4',
      },
    ],
  },
  /*
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
  */
  preReveal: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'background/unborn/pre-reveal.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'background/unborn/pre-reveal.mp4',
      },
    ],
  },
  reveal: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'background/unborn/reveal.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'background/unborn/reveal.mp4',
      },
    ],
  },
  sendoff: {
    sources: [
      {
        type: 'video/webm',
        urlRel: 'background/unborn/sendoff.webm',
      },
      {
        type: 'video/mp4',
        urlRel: 'background/unborn/sendoff.mp4',
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
  shuffleButton: {
    url: '/images/shuffle-button.svg',
  },
};

const getURL = (item) => item.url;
const getURLRel = (item) => item.urlRel;
const getBlob = (item) => item.blob;
const getEl = (item) => item.el;
const fontURLs = fonts.map(getURL);
const styleURLs = styles.map(getURL);
const scriptURLs = scripts.map(getURL);
const imageValues = Object.values(images);
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
  // Videos and canvas images (video "thumbnails") are stored in the external CDN
  for (let i = 0; i < imageValues.length; i++) {
    const image = imageValues[i];
    image.url = videoFolder + getURLRel(image);
  }
  for (let i = 0; i < videoSourcesFlat.length; i++) {
    const videoSource = videoSourcesFlat[i];
    videoSource.url = videoFolder + getURLRel(videoSource);
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
  fontStyleElement.innerHTML = fonts.map((font) => `@font-face{font-family:${font.family};font-weight:${font.weight};src:url('${getBlob(font)}')}`).join('');
  const headElements = [
    fontStyleElement,
    ...styles.map((style) => dictToElement(
      'link',
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: getBlob(style),
        integrity: style.integrity,
        crossorigin: style.crossorigin,
      },
    )),
    ...scripts.map((script) => dictToElement(
      'script',
      {
        src: getBlob(script),
      },
    )),
  ];
  for (let i = 0; i < headElements.length; i++) {
    document.head.appendChild(headElements[i]);
  }
};

const assignPreloadInfoToVideosImagesMisc = (preloadInfo) => {
  const { blobs, videoFolder } = preloadInfo;
  assignVideoFolder(videoFolder);
  // assignBlobs(blobs, videoSourcesFlat);
  // assignBlobs(blobs, imageValues);
  assignBlobs(blobs, miscValues);
};

const loadImage = (url) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => {
    resolve(img);
  };
  img.onerror = (e) => {
    reject(e);
  };
  img.crossOrigin = 'Anonymous';
  img.src = url;
});

// In-DOM 'bench' exists so that all videos exist in the DOM from the get-go
// and still do so ocne "removed", a further anti-flicker measure
let mediaBench;

// No video (or canvas image) will ever need to be in more than one place at any given point
// during the runtime of this app, so avoid the memory impact of a new video element every time
// that video is called for (on browsers where it works like that I guess), and instead give each
// a designated, reusable DOM node
const createImageVideoEls = () => new Promise((resolve, reject) => {
  mediaBench = document.createElement('div');
  document.body.appendChild(mediaBench);
  for (let i = 0; i < videoValues.length; i++) {
    const video = videoValues[i];
    const { sources } = video;
    const videoEl = document.createElement('video');
    videoEl.muted = true;
    videoEl.onload = () => {};
    videoEl.crossOrigin = 'Anonymous';
    videoEl.setAttribute('webkit-playsinline', 'webkit-playsinline');
    videoEl.setAttribute('playsinline', 'playsinline');
    videoEl.setAttribute('preload', 'auto');
    videoEl.className = 'hiddenVideo';
    videoEl.src = '';
    delete videoEl.src;
    for (let j = 0; j < sources.length; j++) {
      const source = sources[j];
      const sourceEl = document.createElement('source');
      sourceEl.onload = () => {};
      sourceEl.crossOrigin = 'Anonymous';
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
  Promise.all(imageValues.map((image) => loadImage(getURL(image)))).then((imageEls) => {
    for (let i = 0; i < imageValues.length; i++) {
      imageValues[i].el = imageEls[i];
    }
    resolve();
  }).catch(reject);
});

const prepareVideo = (props) => {
  const {
    el, className, onPlaying, onEnd,
  } = props;
  el.className = className;
  el.onended = onEnd;
  el.loop = !onEnd;
  // el.currentTime = 0;
  el.onplaying = onPlaying && (() => {
    el.onplaying = undefined;
    onPlaying();
  });
  el.play();
  return el;
};

const hideAndRewindVideo = (props) => {
  const { el } = props;
  el.className = 'hiddenVideo';
  el.pause();
  // Bit of a hacky anti-flicker measure that assumes the no element
  // will be re-appended within a split second of its removal
  setTimeoutBetter(() => { el.currentTime = 0; }, 100);
};

const removeAndRewindVideo = (props) => {
  hideAndRewindVideo(props);
  mediaBench.appendChild(getEl(props));
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
    const allURLsToBecomeBlobs = [...new Set([
      ...fontURLs,
      ...styleURLs,
      ...scriptURLs,
      // ...videoSourceURLs, // Apparently Safari doesn't like videos with blob sources,
      // but loading them this way anyway will hopefully cache them
      // https://discussions.apple.com/thread/254893296?sortBy=best
      // ...imageURLs, // Apparently Safari doesn't like canvas images with blob sources either
      ...miscURLs,
    ])];
    const progresses = Object.assign({}, ...allURLsToBecomeBlobs.map((url) => ({ [url]: {} })));
    Promise.all(allURLsToBecomeBlobs.map((url) => loadBlob({
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
          ...allURLsToBecomeBlobs.map((url, index) => ({
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
  assignPreloadInfoToVideosImagesMisc,
  createImageVideoEls,
  prepareVideo,
  hideAndRewindVideo,
  removeAndRewindVideo,
  images,
  videos,
  misc,
  getBlob,
  getEl,
};
