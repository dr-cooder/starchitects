const React = require('react');
const PropTypes = require('prop-types');
const { px } = require('../../common/helpers');
const { unitsBackgroundWidth, unitsBackgroundHeight } = require('../measurements.js');
const { usePixelsPerUnit } = require('../measurementsReact.js');

const Background = ({
  background, blur, brightness = 1, children,
}) => {
  const { width, height, pixelsPerUnit } = usePixelsPerUnit();
  const backgroundWidth = pixelsPerUnit * unitsBackgroundWidth;
  const backgroundHeight = pixelsPerUnit * unitsBackgroundHeight;
  return (
    <>
      <div className='backgroundDark'></div>
      <div className='backgroundContainer' style={{
        left: (width - backgroundWidth) / 2,
        top: (height - backgroundHeight) / 2,
        width: backgroundWidth,
        height: backgroundHeight,
        filter: blur && `blur(${px(pixelsPerUnit * blur)})`,
        opacity: brightness,
      }}>
        {background}
      </div>
      <div className='foreground'>
        {children}
      </div>
    </>
  );
};

Background.propTypes = {
  background: PropTypes.node,
  blur: PropTypes.number,
  brightness: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node.isRequired),
    PropTypes.node,
  ]),
};

module.exports = Background;
