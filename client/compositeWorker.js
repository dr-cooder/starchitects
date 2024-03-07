const {
  alphaOffset,
  bytesPerPixel,
  vidPartWidth,
  vidPartHeight,
  bytesPerVidPart,
} = require('../common/compositing.js');
const { lerp, hueToRGB, applySaturationValue } = require('../common/helpers.js');

const saturationCenter = 0.75;
const saturationRadius = 0.25;
const valueCenter = 0.75;
const valueRadius = 0.25;

// Assumes sin/cos take in values of range 0...2pi and returns a list of RGB channels of range 0...1
const colorShadeToRGB = (color, shade) => {
  const shadeRadians = shade * 2 * Math.PI;
  const saturation = saturationCenter + saturationRadius * Math.cos(shadeRadians);
  const value = valueCenter + valueRadius * Math.sin(shadeRadians);
  return hueToRGB(color).map((channel) => applySaturationValue(channel, saturation, value));
};

const compositedImageData = new ImageData(vidPartWidth, vidPartHeight);
const compositedBytes = compositedImageData.data;

onmessage = ({
  data: {
    color,
    shade,
    blackBytes,
    whiteBytes,
    alphaBytes,
  },
}) => {
  const finalColor = colorShadeToRGB(color, shade);

  for (let pixelOffset = 0; pixelOffset < bytesPerVidPart; pixelOffset += bytesPerPixel) {
    for (let channelOffset = 0; channelOffset < alphaOffset; channelOffset++) {
      const pixelChannelOffset = pixelOffset + channelOffset;
      compositedBytes[pixelChannelOffset] = lerp(
        blackBytes[pixelChannelOffset],
        whiteBytes[pixelChannelOffset],
        finalColor[channelOffset],
      );
    }

    compositedBytes[pixelOffset + alphaOffset] = alphaBytes[pixelOffset];
  }

  postMessage(compositedImageData);
};

// console.log('Composite worker ready!');
