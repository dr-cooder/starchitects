const React = require('react');
const PropTypes = require('prop-types');

const ErrorScreen = ({ message, onLeave }) => (
  <>
    <p>{message}</p>
    <button onClick={onLeave}>Back</button>
  </>
);

ErrorScreen.propTypes = {
  message: PropTypes.string,
  onLeave: PropTypes.func,
};

module.exports = ErrorScreen;
