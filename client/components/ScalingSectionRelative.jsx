const React = require('react');
const PropTypes = require('prop-types');
const {
  unitsHorizontalInner,
  unitsVerticalInner,
  unitsPerEm,
} = require('../measurements.js');
const { usePixelsPerUnit } = require('../measurementsReact.js');
const { px } = require('../../common/helpers.js');

const ScalingSectionRelative = ({
  leftUnits = 0,
  topUnits = 0,
  widthUnits = unitsHorizontalInner,
  heightUnits = unitsVerticalInner,
  children,
}) => {
  const { pixelsPerUnit } = usePixelsPerUnit();
  return (
    <div className='scalingSection' style={{
      fontSize: px(pixelsPerUnit * unitsPerEm),
      left: px(pixelsPerUnit * leftUnits),
      top: px(pixelsPerUnit * topUnits),
      width: px(pixelsPerUnit * widthUnits),
      height: px(pixelsPerUnit * heightUnits),
    }}>
      {children}
    </div>
  );
};

ScalingSectionRelative.propTypes = {
  leftUnits: PropTypes.number,
  topUnits: PropTypes.number,
  widthUnits: PropTypes.number,
  heightUnits: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node.isRequired),
    PropTypes.node,
  ]),
};

module.exports = ScalingSectionRelative;
