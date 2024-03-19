const React = require('react');
const PropTypes = require('prop-types');
const {
  unitsHorizontalInner,
  unitsVerticalInner,
  unitsPerEm,
} = require('../measurements.js');
const { useGridMeasurements } = require('../measurementsReact.js');
const { px } = require('../../common/helpers.js');

const ScalingSection = ({
  leftUnits = 0,
  topUnits = 0,
  topFreeSpace = 0,
  widthUnits = unitsHorizontalInner,
  heightUnits = unitsVerticalInner,
  heightFreeSpace = 0, // Shouldn't be stretchy by default
  children,
}) => {
  const {
    pixelsPerUnit,
    verticalFreeSpace,
    horizontalOffset,
    verticalOffset,
  } = useGridMeasurements();
  return (
    <div className='scalingSection' style={{
      fontSize: px(pixelsPerUnit * unitsPerEm),
      left: px(horizontalOffset + pixelsPerUnit * leftUnits),
      top: px(verticalOffset + pixelsPerUnit * topUnits + verticalFreeSpace * topFreeSpace),
      width: px(pixelsPerUnit * widthUnits),
      height: px(pixelsPerUnit * heightUnits + verticalFreeSpace * heightFreeSpace),
    }}>
      {children}
    </div>
  );
};

ScalingSection.propTypes = {
  leftUnits: PropTypes.number,
  topUnits: PropTypes.number,
  topFreeSpace: PropTypes.number,
  widthUnits: PropTypes.number,
  heightUnits: PropTypes.number,
  heightFreeSpace: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node.isRequired),
    PropTypes.node,
  ]),
};

module.exports = ScalingSection;
