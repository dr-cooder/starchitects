const React = require('react');
const { useState } = require('react');
const PropTypes = require('prop-types');
const { ScalingSection } = require('../components/index.js');
const { unitsVerticalInner } = require('../measurements.js');
const { misc: { logo }, getBlob } = require('../preload.js');
const { setTimeoutBetter } = require('../../common/helpers.js');

const animationDuration = 4000;
const titleHeight = 84;
const titleTop = (unitsVerticalInner - titleHeight) / 2;

const TitleScreen = ({ onAnimationEnd }) => {
  const [timeoutNotSet, setTimeoutNotSet] = useState(true);
  if (timeoutNotSet) {
    setTimeoutBetter(onAnimationEnd, animationDuration);
    setTimeoutNotSet(false);
  }
  return (
    <div className='titleMain'>
      <ScalingSection
        topUnits={titleTop}
        topFreeSpace={0.5}
        heightUnits={titleHeight}
      >
        <p className='theArchitectsPresent'>The Architects Present</p>
        <img draggable={false} src={getBlob(logo)} alt='Starchitects' className='titleLogo'/>
      </ScalingSection>
    </div>
  );
};

TitleScreen.propTypes = {
  onAnimationEnd: PropTypes.func,
};

module.exports = TitleScreen;
