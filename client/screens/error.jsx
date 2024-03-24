const React = require('react');
const PropTypes = require('prop-types');
const { ScalingSection } = require('../components');
const { unitsVerticalInner } = require('../measurements.js');

const textHeight = 100;
const buttonHeight = 40;

const textTop = (unitsVerticalInner - textHeight - buttonHeight) / 2;
const buttonTop = textTop + textHeight;

const ErrorScreen = ({ message, onLeave }) => (
  <>
    <ScalingSection
      topUnits={textTop}
      topFreeSpace={0.5}
      heightUnits={textHeight}
    >
      <p className={'centeredText'}>{message}</p>
    </ScalingSection>
    <ScalingSection
      topUnits={buttonTop}
      topFreeSpace={0.5}
      heightUnits={buttonHeight}
    >
      <button className='outlined' onClick={onLeave}>Back</button>
    </ScalingSection>
  </>
);

ErrorScreen.propTypes = {
  message: PropTypes.string,
  onLeave: PropTypes.func,
};

module.exports = ErrorScreen;
