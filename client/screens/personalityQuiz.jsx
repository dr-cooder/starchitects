const React = require('react');
const PropTypes = require('prop-types');
const { unitsHorizontalInnerHalf, unitsVerticalInner } = require('../measurements.js');
const { BackgroundVideo, ScalingSection } = require('../components');
const { blobFilenames, blobs } = require('../preload.js');

const questionHeight = 116;
const answerButtonHeight = 64;

const questionTop = (unitsVerticalInner - questionHeight - answerButtonHeight) / 2;
const answerButtonTop = questionTop + questionHeight;

const PersonalityQuizScreen = ({ questions, onSubmit }) => (
  <BackgroundVideo
    blur={25}
    darkness={0.75}
    sources={[
      {
        src: blobs[blobFilenames.placeholderVid],
        type: 'video/mp4',
      },
    ]}
  >
    <ScalingSection
      topUnits={questionTop}
      topFreeSpace={0.5}
      heightUnits={questionHeight}
    >
      <div className={'questionBlock outlined outlinedWithBottomNeighbor'}>
        <div>{questions}</div>
      </div>
    </ScalingSection>
    <ScalingSection
      topUnits={answerButtonTop}
      topFreeSpace={0.5}
      widthUnits={unitsHorizontalInnerHalf}
      heightUnits={answerButtonHeight}
    >
      <button className={'outlined quizButton1 outlinedWithTopNeighbor outlinedWithRightNeighbor'} onClick={() => onSubmit({
        sampleQuestion: 'Sample Answer',
      })}>Submit</button>
    </ScalingSection>
    <ScalingSection
      leftUnits={unitsHorizontalInnerHalf}
      topUnits={answerButtonTop}
      topFreeSpace={0.5}
      widthUnits={unitsHorizontalInnerHalf}
      heightUnits={answerButtonHeight}
    >
      <button className={'outlined quizButton2 outlinedWithTopNeighbor outlinedWithLeftNeighbor'}>Don&apos;t submit</button>
    </ScalingSection>
  </BackgroundVideo>
);

PersonalityQuizScreen.propTypes = {
  questions: PropTypes.any,
  onSubmit: PropTypes.func,
};

module.exports = PersonalityQuizScreen;
