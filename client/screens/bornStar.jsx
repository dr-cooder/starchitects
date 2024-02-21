const React = require('react');
const { useState } = require('react');
const PropTypes = require('prop-types');
const { BackgroundImage, ScalingSection } = require('../components');
const { blobFilenames, blobs } = require('../preload.js');

const defaultSpinSpeedValue = 0;
const spinSpeedGranularity = 1000;

// TODO: "Hold to glow" button is not reliable
const BornStarScreen = ({ starData, onSetStarGlow, onSetStarSpinSpeed }) => {
  const [spinSpeedValue, setSpinSpeedValue] = useState(defaultSpinSpeedValue);
  return (
    <BackgroundImage
      src={blobs[blobFilenames.tempBG]}
      darkness={0.75}
    >
      <ScalingSection>
        <p>{JSON.stringify(starData)}</p>
        <button
          onMouseDown={() => onSetStarGlow(true)}
          onMouseUp={() => onSetStarGlow(false)}
          onTouchStart={() => onSetStarGlow(true)}
          onTouchEnd={() => onSetStarGlow(false)}
        >
          Hold to glow
        </button>
        <input
          onChange={(event) => {
            const value = event.target.value / spinSpeedGranularity;
            setSpinSpeedValue(value);
            onSetStarSpinSpeed(value);
          }}
          type="range"
          min={0}
          max={spinSpeedGranularity}
          defaultValue={Math.floor(defaultSpinSpeedValue * spinSpeedGranularity)}
        />
        <p>{spinSpeedValue}</p>
      </ScalingSection>
    </BackgroundImage>
  );
};

BornStarScreen.propTypes = {
  starData: PropTypes.object,
  onSetStarGlow: PropTypes.func,
  onSetStarSpinSpeed: PropTypes.func,
};

module.exports = BornStarScreen;
