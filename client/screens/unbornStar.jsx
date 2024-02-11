const React = require('react');
const PropTypes = require('prop-types');

const UnbornStarScreen = ({ starData, onSwipeStarUp }) => (
  <>
    <div>Congratulations! Here is your star! Now, go to (insert our room
      building+number here) and swipe your star up into the galaxy!</div>
    <div>{JSON.stringify(starData)}</div>
    <button onClick={onSwipeStarUp}>&quot;Swipe up&quot;</button>
  </>
);

UnbornStarScreen.propTypes = {
  starData: PropTypes.object,
  onSwipeStarUp: PropTypes.func,
};

module.exports = UnbornStarScreen;
