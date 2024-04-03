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
    starRGB,
    dustRGB,
    basisBytes,
    starDiffBytes,
    dustDiffBytes,
    starTimesDustDiffBytes,
    alphaBytes,
  },
}) => {
  const starTimesDustRGB = [];
  for (let channelOffset = 0; channelOffset < alphaOffset; channelOffset++) {
    starTimesDustRGB[channelOffset] = starRGB[channelOffset] * dustRGB[channelOffset];
  }
  for (let pixelOffset = 0; pixelOffset < bytesPerVidPart; pixelOffset += bytesPerPixel) {
    for (let channelOffset = 0; channelOffset < alphaOffset; channelOffset++) {
      const pixelChannelOffset = pixelOffset + channelOffset;
      compositedBytes[pixelChannelOffset] = basisBytes[pixelChannelOffset]
        + starDiffBytes[pixelChannelOffset] * starRGB[channelOffset]
        + dustDiffBytes[pixelChannelOffset] * dustRGB[channelOffset]
        + starTimesDustDiffBytes[pixelChannelOffset] * starTimesDustRGB[channelOffset];
    }

    compositedBytes[pixelOffset + alphaOffset] = alphaBytes[pixelOffset];
  }

  postMessage(compositedImageData);
};

// console.log('Composite worker ready!');
