const React = require('react');
const PropTypes = require('prop-types');

const AnimationButtonCooldown = ({ duration }) => (
  <svg viewBox='0 0 100 111' xmlns='http://www.w3.org/2000/svg'></svg>
);

AnimationButtonCooldown.propTypes = {
  duration: PropTypes.number,
};

module.exports = AnimationButtonCooldown;
