const React = require('react');
const { useState } = require('react');
const PropTypes = require('prop-types');

const defaultSpinSpeedValue = 0;

// TODO: "Hold to glow" button is not reliable
const BornStarScreen = ({ starData, onSetStarGlow, onSetStarSpinSpeed }) => {
  const [spinSpeedValue, setSpinSpeedValue] = useState(defaultSpinSpeedValue);
  return (
    <>
      <div>{JSON.stringify(starData)}</div>
      <button onMouseDown={() => onSetStarGlow(true)} onMouseUp={() => onSetStarGlow(false)}>
        Hold to glow
      </button>
      <input
        onChange={(event) => {
          const { value } = event.target;
          setSpinSpeedValue(value);
          onSetStarSpinSpeed(value);
        }}
        type="range"
        min={0}
        max={1000}
        defaultValue={defaultSpinSpeedValue}
      />
      <div>{spinSpeedValue}</div>
    </>
  );
};

BornStarScreen.propTypes = {
  starData: PropTypes.object,
  onSetStarGlow: PropTypes.func,
  onSetStarSpinSpeed: PropTypes.func,
};

module.exports = BornStarScreen;
