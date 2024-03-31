const React = require('react');
const { createRef, useEffect } = require('react');
const PropTypes = require('prop-types');
const { unitsHorizontalInnerHalf, unitsVerticalInner } = require('../measurements.js');
const { Background, ScalingSection, VideoSequence } = require('../components');
const { videos } = require('../preload.js');

const questionHeight = 116;
const answerButtonHeight = 64;

const questionTop = (unitsVerticalInner - questionHeight - answerButtonHeight) / 2;
const answerButtonTop = questionTop + questionHeight;

const PersonalityQuizScreen = ({ questions, onSubmit }) => {
  const backgroundVideoRef = createRef();
  const nextBackground = () => backgroundVideoRef.current.next();
  const questionsParentRef = createRef();
  useEffect(nextBackground, []);
  return (
    <div className='quizFadeIn'>
      <Background
        background={<VideoSequence
          ref={backgroundVideoRef}
          videos={[
            {
              el: videos.quizBgTestStart.el,
              className: 'background',
              onEnd: () => {
                nextBackground();
                setTimeout(() => {
                  questionsParentRef.current.style.visibility = 'visible';
                }, 500);
              },
            },
            {
              el: videos.quizBgTestLoop.el,
              className: 'background quizBackgroundLoop',
            },
            {
              el: videos.quizBgTestLoop.el,
              className: 'background quizBackgroundNextStart',
              onEnd: () => onSubmit({
                sampleQuestion: 'Sample Answer',
              }),
            },
          ]}
        />}
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
            <button className={'outlined quizButton1 outlinedWithTopNeighbor outlinedWithRightNeighbor'} onClick={() => {
              questionsParentRef.current.style.visibility = 'hidden';
              backgroundVideoRef.current.next();
            }}>Submit</button>
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
