const React = require('react');
const PropTypes = require('prop-types');
const { useWindowMeasurements } = require('../windowMeasurements.js');

const Background = ({ background, darkness, children }) => (
  <div style={useWindowMeasurements()}>
    {background}
    <div className='foreground' style={{ backgroundColor: `rgba(0,0,0,${darkness ?? 0})` }}>
      {children}
    </div>
  </div>
);

Background.propTypes = {
  background: PropTypes.node,
  darkness: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node.isRequired),
    PropTypes.node,
  ]),
};

module.exports = Background;
