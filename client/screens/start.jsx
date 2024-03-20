const React = require('react');
const PropTypes = require('prop-types');
const { BackgroundImage, ScalingSection } = require('../components');
const { blobFilenames, blobs } = require('../preload.js');
const { unitsVerticalInner } = require('../measurements.js');

const textHeight = 190;
const buttonHeight = 40;

const textTop = (unitsVerticalInner - textHeight - buttonHeight) / 2;
const buttonTop = unitsVerticalInner - buttonHeight;

const StartScreen = ({ onCreateStar, onSimulateRoom }) => (
  <BackgroundImage
    src={blobs[blobFilenames.tempBG]}
  >
    <ScalingSection
      topUnits={textTop}
      topFreeSpace={0.5}
      heightUnits={textHeight}
    >
      <p className='header'>Show us <span className='emphasized'>your</span> shine!</p>
      <p>Every atom that makes up your body was created from a star before Earth
        was even born. We are all made up of <span className='emphasized'>stardust</span>.</p>
      <p>But we want to know what makes <span className='emphasized'>you</span> shine.
        To do that, let&apos;s get to know you.</p>
    </ScalingSection>
    <ScalingSection
      topUnits={buttonTop}
      topFreeSpace={1}
      heightUnits={buttonHeight}
    >
      <button className='outlined' onClick={onCreateStar}>Begin Survey</button>
    </ScalingSection>
    <ScalingSection
      heightUnits={buttonHeight}
    >
      <button className='outlined' onClick={onSimulateRoom}>(DEBUG) Room Sim</button>
    </ScalingSection>
  </BackgroundImage>
);

StartScreen.propTypes = {
  onCreateStar: PropTypes.func,
  onSimulateRoom: PropTypes.func,
};

module.exports = StartScreen;
