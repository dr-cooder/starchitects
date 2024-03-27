const React = require('react');
const { createRef, useEffect } = require('react');
const PropTypes = require('prop-types');
const { unitsBackgroundWidth, unitsBackgroundHeight, unitsPerEm } = require('../measurements.js');
const { usePixelsPerUnit } = require('../measurementsReact.js');
const { px } = require('../../common/helpers.js');

const Background = ({
  background, children,
}) => {
  const containerRef = createRef();
  const { width, height, pixelsPerUnit } = usePixelsPerUnit();
  const backgroundWidth = pixelsPerUnit * unitsBackgroundWidth;
  const backgroundHeight = pixelsPerUnit * unitsBackgroundHeight;
  useEffect(() => {
    containerRef.current.setAttribute('inert', '');
  }, []);
  return (
    <>
      <div className='backgroundDark'></div>
      <div className='backgroundContainer' ref={containerRef} style={{
        fontSize: px(pixelsPerUnit * unitsPerEm),
        left: px((width - backgroundWidth) / 2),
        top: px((height - backgroundHeight) / 2),
        width: px(backgroundWidth),
        height: px(backgroundHeight),
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
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node.isRequired),
    PropTypes.node,
  ]),
};

module.exports = Background;
