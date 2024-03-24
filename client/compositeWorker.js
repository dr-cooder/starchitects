const {
  alphaOffset,
  bytesPerPixel,
  vidPartWidth,
  vidPartHeight,
  bytesPerVidPart,
} = require('../common/compositing.js');

const compositedImageData = new ImageData(vidPartWidth, vidPartHeight);
const compositedBytes = compositedImageData.data;

onmessage = ({
  data: {
    rgb,
    blackBytes,
    bwDiffBytes,
    alphaBytes,
  },
}) => {
  for (let pixelOffset = 0; pixelOffset < bytesPerVidPart; pixelOffset += bytesPerPixel) {
    for (let channelOffset = 0; channelOffset < alphaOffset; channelOffset++) {
      const pixelChannelOffset = pixelOffset + channelOffset;
      compositedBytes[pixelChannelOffset] = blackBytes[pixelChannelOffset]
        + bwDiffBytes[pixelChannelOffset] * rgb[channelOffset];
    }

    compositedBytes[pixelOffset + alphaOffset] = alphaBytes[pixelOffset];
  }

  postMessage(compositedImageData);
};

// console.log('Composite worker ready!');
