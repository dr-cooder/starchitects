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

// TODO: Consider not preloading video, and instead firing on 'canplay'?
const videos = {
  placeholderStarVid: [
    {
      type: 'video/mp4',
      filename: '/videos/composite/star/placeholder.mp4',
    },
  ],
  quizBgTestStart: [
    {
      type: 'video/webm',
      filename: '/videos/background/quiz/test-start.webm',
    },
    {
      type: 'video/mp4',
      filename: '/videos/background/quiz/test-start.mp4',
    },
  ],
  quizBgTestLoop: [
    {
      type: 'video/webm',
      filename: '/videos/background/quiz/test-loop.webm',
    },
    {
      type: 'video/mp4',
      filename: '/videos/background/quiz/test-loop.mp4',
    },
  ],
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
};

const getFilename = (item) => item.filename;
const fontFilenames = fonts.map(getFilename);
const styleFilenames = styles.map(getFilename);
const scriptFilenames = scripts.map(getFilename);
const videosFlat = Object.values(videos).flat();
const videoFilenames = videosFlat.map(getFilename);
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
  assignBlobs(allBlobs, videosFlat);
  assignBlobs(allBlobs, miscValues);
};

// Doing this without React is necessary to create the video node without appending it to the DOM,
// such that it may load and then call 'canplaythrough' before it is shown
const videoToEl = ({ video, className, onEnd }) => new Promise((resolve, reject) => {
  // TODO: Variable checking here
  const videoEl = document.createElement('video');
  videoEl.className = className;
  // videoEl.autoplay = true;
  videoEl.muted = true; // Necessary for autoplay policy
  const loop = onEnd == null;
  videoEl.loop = loop;
  for (let i = 0; i < video.length; i++) {
    const source = video[i];
    const sourceEl = document.createElement('source');
    sourceEl.type = source.type;
    sourceEl.src = source.blob;
    videoEl.appendChild(sourceEl);
  }
  videoEl.addEventListener('canplaythrough', () => {
    videoEl.play();
    resolve(videoEl);
  });
  if (!loop) {
    videoEl.addEventListener('ended', onEnd);
  }
  videoEl.addEventListener('error', reject);
});

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
    ...videoFilenames,
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
  videoToEl,
  videos,
  misc,
};
