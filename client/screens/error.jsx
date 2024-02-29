const React = require('react');
const PropTypes = require('prop-types');
const { BackgroundImage, ScalingSection } = require('../components');
const { blobFilenames, blobs } = require('../preload.js');
const { unitsVerticalInner } = require('../scalingMeasurements.js');

const textHeight = 100;
const buttonHeight = 40;

const textTop = (unitsVerticalInner - textHeight - buttonHeight) / 2;
const buttonTop = textTop + textHeight;

const ErrorScreen = ({ message, onLeave }) => (
  <BackgroundImage
    src={blobs[blobFilenames.tempBG]}
    darkness={0.75}
  >
    <ScalingSection
      topUnits={textTop}
      topFreeSpace={0.5}
      heightUnits={textHeight}
    >
      <p className={'centeredText'}>{message}</p>
    </ScalingSection>
    <ScalingSection
      topUnits={buttonTop}
      topFreeSpace={0.5}
      heightUnits={buttonHeight}
    >
      <button className='outlined' onClick={onLeave}>Back</button>
    </ScalingSection>
  </BackgroundImage>
);

ErrorScreen.propTypes = {
  message: PropTypes.string,
  onLeave: PropTypes.func,
};

module.exports = ErrorScreen;
