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
];

const scripts = [
  {
    filename: '/main.js',
  },
];

const getFilename = (item) => item.filename;
const fontFilenames = fonts.map(getFilename);
const styleFilenames = styles.map(getFilename);
const scriptFilenames = scripts.map(getFilename);

const blobFilenames = {
  placeholderVid: '/videos/placeholder.mp4',
  tempBG: '/images/background-ref.png', // '/images/temp-bg.jpg',
  placeholderStarVid: '/videos/placeholder-star.mp4',
  compositeWorker: '/composite-worker.js',
};
// TODO: This doesn't seem necessary for this app? Canvases will only use
// primitive shapes and composited image data from a video element
const imageFilenames = {};

const blobFilenameValues = Object.values(blobFilenames);
const imageFilenameValues = Object.values(imageFilenames);

const blobs = {};
const images = {};

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

const assignToBlobsImages = (allBlobs) => {
  Object.assign(blobs, ...blobFilenameValues.map((filename) => ({
    [filename]: allBlobs[filename],
  })));
  Object.assign(images, ...imageFilenameValues.map((filename) => {
    const img = new Image();
    img.src = allBlobs[filename];
    return { [filename]: img };
  }));
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
    ...blobFilenameValues,
    ...imageFilenameValues,
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
  blobFilenames,
  imageFilenames,
  blobs,
  images,
  assignBlobSrcsToFontsStylesScripts,
  fontsStylesScriptsToHead,
  assignToBlobsImages,
};
