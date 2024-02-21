const React = require('react');
const PropTypes = require('prop-types');
const { BackgroundImage, ScalingSection } = require('../components');
const { blobFilenames, blobs } = require('../preload.js');

const ErrorScreen = ({ message, onLeave }) => (
  <BackgroundImage
    src={blobs[blobFilenames.tempBG]}
    darkness={0.75}
  >
    <ScalingSection>
      <p>{message}</p>
      <button onClick={onLeave}>Back</button>
    </ScalingSection>
  </BackgroundImage>
);

ErrorScreen.propTypes = {
  message: PropTypes.string,
  onLeave: PropTypes.func,
};

module.exports = ErrorScreen;
