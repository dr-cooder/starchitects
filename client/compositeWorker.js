const {
  maskOffset,
  changeableValueMapOffset,
  changeableMaskOffset,
  alphaOffset,
  bytesPerPixel,
  byteMax,
  vidPartWidth,
  vidPartHeight,
  bytesPerVidPart,
  saturationRadius,
  valueRadius,
  valueRange,
} = require('../common/compositing.js');
const { lerp, hueToRGB } = require('../common/helpers.js');

const compositedImageData = new ImageData(vidPartWidth, vidPartHeight);
const compositedBytes = compositedImageData.data;

onmessage = ({
  data: {
    color,
    shade,
    albedoBytes,
    shadingBytes,
    specularBytes,
    grayscalesBytes,
  },
}) => {
  const shadeRadians = shade * 2 * Math.PI;
  const desaturation = saturationRadius * (1 - Math.cos(shadeRadians));
  const hueSaturation = hueToRGB(color).map((c) => c + desaturation * (1 - c));

  // "change" image is really a greyscale "value map", with black being the
  // lowest in the range of possible values, and white being the highest.
  // Sine (Y) determines where that range starts
  const valueAdditionByte = (valueRadius * Math.sin(shadeRadians) + valueRadius) * byteMax;

  for (let pixelOffset = 0; pixelOffset < bytesPerVidPart; pixelOffset += bytesPerPixel) {
    const changeableValueMapByte = grayscalesBytes[pixelOffset + changeableValueMapOffset];
    const changeableMask = grayscalesBytes[pixelOffset + changeableMaskOffset] / byteMax;

    for (let channelOffset = 0; channelOffset < alphaOffset; channelOffset++) {
      const pixelColorChannelOffset = pixelOffset + channelOffset;
      compositedBytes[pixelColorChannelOffset] = lerp(
        albedoBytes[pixelColorChannelOffset],
        (valueAdditionByte + valueRange * changeableValueMapByte)
        * hueSaturation[channelOffset],
        changeableMask,
      )
        * (shadingBytes[pixelColorChannelOffset] / byteMax)
        + specularBytes[pixelColorChannelOffset];
    }

    compositedBytes[pixelOffset + alphaOffset] = grayscalesBytes[pixelOffset + maskOffset];
  }

  postMessage(compositedImageData);
};

console.log('Composite worker ready!');
