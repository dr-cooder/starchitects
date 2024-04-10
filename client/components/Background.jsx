const React = require('react');
const PropTypes = require('prop-types');
const Inert = require('./Inert.jsx');
const { unitsBackgroundWidth, unitsBackgroundHeight, unitsPerEm } = require('../measurements.js');
const { usePixelsPerUnit } = require('../measurementsReact.js');
const { px } = require('../../common/helpers.js');

const Background = ({
  background, visible = true, children,
}) => {
  const { width, height, pixelsPerUnit } = usePixelsPerUnit();
  const backgroundWidth = pixelsPerUnit * unitsBackgroundWidth;
  const backgroundHeight = pixelsPerUnit * unitsBackgroundHeight;
  return (
    <>
      <div style={{ visibility: visible ? 'visible' : 'hidden' }}>
        <div className='backgroundDark'></div>
        <Inert inert={true}>
          <div className='backgroundContainer' style={{
            fontSize: px(pixelsPerUnit * unitsPerEm),
            left: px((width - backgroundWidth) / 2),
            top: px((height - backgroundHeight) / 2),
            width: px(backgroundWidth),
            height: px(backgroundHeight),
          }}>
            {background}
          </div>
        </Inert>
      </div>
      <div className='foreground'>
        {children}
      </div>
    </>
  );
};

Background.propTypes = {
  background: PropTypes.node,
  visible: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node.isRequired),
    PropTypes.node,
  ]),
};

module.exports = Background;
