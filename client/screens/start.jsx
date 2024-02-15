const React = require('react');
const PropTypes = require('prop-types');

const StartScreen = ({ onCreateStar, onSimulateRoom }) => (
  <>
    <h1>Starchitects</h1>
    <p>You, and everyone around you, all have one thing in common.
      We are all made up of <span className="emphasized">stardust</span>.</p>
    <p>A long time ago, every single atom that makes up your body
      was created inside a star before Earth was born.</p>
    <p>But we want to know what makes YOU shine. To do that,
      let&apos;s get to know you.</p>
    <button onClick={onCreateStar}>Continue</button>
    <button onClick={onSimulateRoom}>(DEBUG) Simulate room</button>
  </>
);

StartScreen.propTypes = {
  onCreateStar: PropTypes.func,
  onSimulateRoom: PropTypes.func,
};

module.exports = StartScreen;
