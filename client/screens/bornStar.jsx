const React = require('react');
const PropTypes = require('prop-types');

const BornStarScreen = ({ starData, onSetStarGlow, onSetStarSpinSpeed }) => (
  <>
    <div>{JSON.stringify(starData)}</div>
    <button onMouseDown={() => onSetStarGlow(true)} onMouseUp={() => onSetStarGlow(false)}>
      Hold to glow
    </button>
    <input onChange={onSetStarSpinSpeed} type="range" min="0" max="1000" value="0"/>
  </>
);

BornStarScreen.propTypes = {
  starData: PropTypes.object,
  onSetStarGlow: PropTypes.func,
  onSetStarSpinSpeed: PropTypes.func,
};

module.exports = BornStarScreen;
