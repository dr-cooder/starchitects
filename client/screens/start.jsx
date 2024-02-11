const React = require('react');
const PropTypes = require('prop-types');

const StartScreen = ({ onCreateStar, onSimulateRoom }) => (
  <>
    <div>Show us your shine!</div>
    <button onClick={onCreateStar}>Create a star!</button>
    <button onClick={onSimulateRoom}>(DEBUG) Simulate room</button>
  </>
);

StartScreen.propTypes = {
  onCreateStar: PropTypes.func,
  onSimulateRoom: PropTypes.func,
};

module.exports = StartScreen;
