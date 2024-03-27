const React = require('react');
const { createRef, useEffect } = require('react');
const PropTypes = require('prop-types');
const { unitsHorizontalInnerHalf, unitsVerticalInner } = require('../measurements.js');
const { Background, ChangingVideo, ScalingSection } = require('../components');
const { videos } = require('../preload.js');

const questionHeight = 116;
const answerButtonHeight = 64;

const questionTop = (unitsVerticalInner - questionHeight - answerButtonHeight) / 2;
const answerButtonTop = questionTop + questionHeight;

const PersonalityQuizScreen = ({ questions, onSubmit }) => {
  const backgroundVideoRef = createRef();
  const questionsParentRef = createRef();
  useEffect(() => {
    backgroundVideoRef.current.changeVideo({
      video: videos.quizBgTestStart,
      className: 'background',
      // className: 'quizBackgroundNextStart',
      onEnd: () => {
        backgroundVideoRef.current.changeVideo({
          video: videos.quizBgTestLoop,
          className: 'background quizBackgroundLoop',
        }).then(() => {
          console.log('video 2');
          setTimeout(() => {
            questionsParentRef.current.style.visibility = 'visible';
          }, 500);
        });
      },
    }).then(() => console.log('video 1'));
  }, []);
  return (
    <div className='quizFadeIn'>
      <Background
        background={<ChangingVideo ref={backgroundVideoRef}/>}
      >
        <div ref={questionsParentRef} style={{ visibility: 'hidden' }}>
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
        </div>
      </Background>
    </div>
  );
};

PersonalityQuizScreen.propTypes = {
  questions: PropTypes.any,
  onSubmit: PropTypes.func,
};

module.exports = PersonalityQuizScreen;
