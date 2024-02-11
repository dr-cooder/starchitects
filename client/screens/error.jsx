const React = require('react');
const PropTypes = require('prop-types');

const ErrorScreen = ({ message, onLeave }) => (
  <>
    <div>{message}</div>
    <button onClick={onLeave}>Back</button>
  </>
);

ErrorScreen.propTypes = {
  message: PropTypes.string,
  onLeave: PropTypes.func,
};

module.exports = ErrorScreen;
