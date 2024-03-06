// TODO: Build preload and main separately, and have the former load the latter as one of its blobs
// (This means the loading screen can't use React)

const blobFilenames = {
  placeholderVid: '/videos/placeholder.mp4',
  tempBG: '/images/temp-bg.jpg',
  placeholderStarVid: '/videos/placeholder-star.mp4',
  compositeWorker: '/composite-worker.js',
};

const imageFilenames = {};

const blobs = {};
const images = {};

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
  const blobFilenameValues = Object.values(blobFilenames);
  const imageFilenameValues = Object.values(imageFilenames);
  const allFilenames = [...new Set([
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
  }))).then((blobUrlList) => {
    const blobUrlDict = Object.assign({}, ...allFilenames.map((filename, index) => ({
      [filename]: blobUrlList[index],
    })));
    Object.assign(blobs, ...blobFilenameValues.map((filename) => ({
      [filename]: blobUrlDict[filename],
    })));
    Object.assign(images, ...imageFilenameValues.map((filename) => {
      const img = new Image();
      img.src = blobUrlDict[filename];
      return { [filename]: img };
    }));
    preloading = false;
    resolve();
  }).catch(() => {
    preloading = false;
    reject();
  });
}));

// TODO: Also ensure browser has canvas support (even though techincally a browser that
// can't run React will almost certainly not be able to use canvas either?)
// TODO: Ensure that, if the browser has canvas support, it can also render a video in canvas
// (if it can't, use a still?)
module.exports = {
  preload,
  blobFilenames,
  imageFilenames,
  blobs,
  images,
};
