const React = require('react');
const PropTypes = require('prop-types');
const { unitsHorizontal, unitsVerticalInner } = require('../scalingMeasurements.js');
const { BackgroundImage, ScalingSection } = require('../components');
const { blobFilenames, blobs } = require('../preload.js');

const textHeight = 288;
const buttonHeight = 40;

const textTop = (unitsVerticalInner - textHeight - buttonHeight) / 2;
const buttonTop = unitsVerticalInner - buttonHeight;

const StartScreen = ({ onCreateStar, onSimulateRoom }) => (
  <BackgroundImage
    src={blobs[blobFilenames.tempBG]}
    darkness={0.75}
  >
    <ScalingSection
      topUnits={textTop}
      topFreeSpace={0.5}
      heightUnits={textHeight}
      className={'centeredText'}
    >
      <p className='header'>Show us <span className='emphasized'>your</span> shine!</p>
      <p>You, and everyone around you, all have one thing in common.
        We are all made up of <span className='emphasized'>stardust</span>.</p>
      <p>A long time ago, every single atom that makes up your body
        was created inside a star before Earth was born.</p>
      <p>But we want to know what makes YOU shine. To do that,
        let&apos;s get to know you.</p>
    </ScalingSection>
    <ScalingSection
      topUnits={buttonTop}
      topFreeSpace={1}
      widthUnits={unitsHorizontal}
      heightUnits={buttonHeight}
    >
      <button className='outlined' onClick={onCreateStar}>Begin Survey</button>
    </ScalingSection>
    <ScalingSection
      widthUnits={unitsHorizontal}
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
