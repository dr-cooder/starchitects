const React = require('react');
const PropTypes = require('prop-types');

const UnbornStarScreen = ({ starData, onSwipeStarUp }) => (
  <>
    <p>Congratulations! Here is your star! After you&apos;re done adjusting its colors,
      go to (insert our room building+number here) and swipe your star up into the galaxy!</p>
    <p>{JSON.stringify(starData)}</p>
    <p>(Pretend there are three concentric, circular hue sliders here; they will control
      the star&apos;s primary, secondary, and glow colors)</p>
    <button onClick={() => onSwipeStarUp({
      primary: 'FF0000',
      secondary: '00FF00',
      glow: '0000FF',
    })}>&quot;Swipe up&quot;</button>
  </>
);

UnbornStarScreen.propTypes = {
  starData: PropTypes.object,
  onSwipeStarUp: PropTypes.func,
};

module.exports = UnbornStarScreen;
