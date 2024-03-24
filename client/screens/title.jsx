const React = require('react');
const PropTypes = require('prop-types');
const { ScalingSection } = require('../components/index.js');
const { unitsVerticalInner } = require('../measurements.js');
const { preventChildrenFromCalling } = require('../../common/helpers.js');
const { blobFilenames, blobs } = require('../preload.js');

const titleHeight = 84;
const titleTop = (unitsVerticalInner - titleHeight) / 2;

const TitleScreen = ({ onAnimationEnd }) => (
  <div className='titleMain' onAnimationEnd={preventChildrenFromCalling(onAnimationEnd)}>
    <ScalingSection
      topUnits={titleTop}
      topFreeSpace={0.5}
      heightUnits={titleHeight}
    >
      <p className='theArchitectsPresent'>The Architects Present</p>
      <img className='titleLogo' src={blobs[blobFilenames.logo]}/>
    </ScalingSection>
  </div>
);

TitleScreen.propTypes = {
  onAnimationEnd: PropTypes.func,
};

module.exports = TitleScreen;
