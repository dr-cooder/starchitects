const React = require('react');
const { useRef, useState } = require('react');
const PropTypes = require('prop-types');
const { questions, percentPerQuestion } = require('../personalityQuizQuestions.js');
const { unitsHorizontalInnerHalf, unitsVerticalInner } = require('../measurements.js');
const {
  Background, Inert, ScalingSection, VideoSequence,
} = require('../components');
const { videos, misc, getEl } = require('../preload.js');
const { percent, preventChildrenFromCalling } = require('../../common/helpers.js');

const questionHeight = 116;
const answerButtonHeight = 64;

const questionTop = (unitsVerticalInner - questionHeight - answerButtonHeight) / 2;
const answerButtonTop = questionTop + questionHeight;

const animationClassNames = {
  notStartedYet: {
    progress: 'quizNotStartedYet',
    questionBlock: 'quizNotStartedYet',
  },
  goingIn: {
    progress: 'quizProgressIn',
    questionBlock: 'questionBlockIn',
  },
  idle: {
    progress: 'quizProgressIn',
    questionBlock: 'questionBlockIn',
  },
  goingOut: {
    progress: 'quizProgressOut',
    questionBlock: 'questionBlockOut',
  },
};

const answerButtonGenerator = (isAnswer1) => {
  const answerId = isAnswer1 ? 1 : 0;
  const leftUnits = isAnswer1 ? unitsHorizontalInnerHalf : 0;
  const AnswerButton = ({
    currentQuestion,
    currentAnswer,
    registerAnswer,
  }) => (
    <ScalingSection
      leftUnits={leftUnits}
      topUnits={answerButtonTop}
      topFreeSpace={0.5}
      widthUnits={unitsHorizontalInnerHalf}
      heightUnits={answerButtonHeight}
    >
      <button
        className={`outlined outlinedWithTopNeighbor${isAnswer1 ? ' quizButton2 outlinedWithLeftNeighbor' : ' quizButton1 outlinedWithRightNeighbor'}${currentAnswer === answerId ? ' pressed' : ''}`}
        onClick={() => registerAnswer(answerId)}
      >{currentQuestion.answers[answerId].text}</button>
    </ScalingSection>
  );
  AnswerButton.propTypes = {
    currentQuestion: PropTypes.object,
    currentAnswer: PropTypes.number,
    registerAnswer: PropTypes.func,
  };
  return AnswerButton;
};
const AnswerButton1 = answerButtonGenerator(false);
const AnswerButton2 = answerButtonGenerator(true);

const PersonalityQuizScreen = ({ onSubmit }) => {
  const {
    notStartedYet, goingIn, idle, goingOut,
  } = animationClassNames;
  const {
    quizBg1Start,
    quizBg1Loop,
    quizBg2Start,
    quizBg2Loop,
    quizBg3Start,
    quizBg3Loop,
    quizBg4Start,
    quizBg4Loop,
    quizBg5Start,
    quizBg5Loop,
    quizBgEnd,
  } = videos;
  const backgroundVideoRef = useRef();
  const nextBackground = () => backgroundVideoRef.current.next();
  const [questionsDone, setQuestionsDone] = useState(0);
  const [animationClassName, setAnimationClassName] = useState(notStartedYet);
  const {
    progress: progressClassName,
    questionBlock: quesionBlockClassName,
  } = animationClassName;
  const [currentQuestion, setCurrentQuestion] = useState(questions.askYourself);
  const [currentAnswer, setCurrentAnswer] = useState(undefined);
  const [answerList, setAnswerList] = useState('');
  const [outerClassName, setOuterClassName] = useState('quizNotStartedYet');
  const registerAnswer = (answerId) => {
    setCurrentAnswer(answerId);
    setAnswerList(answerList + answerId);
    setQuestionsDone(questionsDone + 1);
    setAnimationClassName(goingOut);
  };
  // useEffect(nextBackground, []);
  return (
    <div className={outerClassName} onAnimationEnd={outerClassName === 'quizFadeOut' ? (() => onSubmit(answerList)) : undefined}>
      <Background
        background={<VideoSequence
          ref={backgroundVideoRef}
          onReady={() => {
            setOuterClassName('quizFadeIn');
            nextBackground();
          }}
          videos={[
            ...[
              [quizBg1Start, quizBg1Loop],
              [quizBg2Start, quizBg2Loop],
              [quizBg3Start, quizBg3Loop],
              [quizBg4Start, quizBg4Loop],
              [quizBg5Start, quizBg5Loop],
            ].map(([start, loop], index) => [
              {
                el: getEl(start),
                className: `background${index === 0 ? '' : ' quizBackgroundNextStart'}`,
                onEnd: () => {
                  setAnimationClassName(goingIn);
                  nextBackground();
                },
              },
              {
                el: getEl(loop),
                className: 'background quizBackgroundLoop',
              },
            ]).flat(),
            {
              el: getEl(quizBgEnd),
              className: 'background quizBackgroundNextStart',
              onEnd: () => setOuterClassName('quizFadeOut'),
            },
          ]}
        />}
      >
        <Inert inert={animationClassName !== idle}>
          <div className={progressClassName}>
            <ScalingSection heightUnits={0}>
              <div className='quizProgress'>
                <div className='quizProgressPercent' style={{
                  width: percent(percentPerQuestion * questionsDone),
                }}>
                  <div className='quizProgressBar'></div>
                  <img src={misc.progressStar.blob} alt='Progress star' className='quizProgressStar'/>
                </div>
              </div>
            </ScalingSection>
          </div>
          <div
            className={quesionBlockClassName}
            onAnimationEnd={preventChildrenFromCalling(() => {
              if (animationClassName === goingIn) {
                setAnimationClassName(idle);
              } else {
                const { next } = currentQuestion.answers[currentAnswer];
                if (next) {
                  setCurrentQuestion(questions[next]);
                }
                setCurrentAnswer(undefined);
                nextBackground();
              }
            })}
          >
            <ScalingSection
              topUnits={questionTop}
              topFreeSpace={0.5}
              heightUnits={questionHeight}
            >
              <div className={'questionBlock outlined outlinedWithBottomNeighbor'}>
                <div>{currentQuestion.text}</div>
              </div>
            </ScalingSection>
            <AnswerButton1
              currentQuestion={currentQuestion}
              currentAnswer={currentAnswer}
              registerAnswer={registerAnswer}
            />
            <AnswerButton2
              currentQuestion={currentQuestion}
              currentAnswer={currentAnswer}
              registerAnswer={registerAnswer}
            />
          </div>
        </Inert>
      </Background>
    </div>
  );
};

PersonalityQuizScreen.propTypes = {
  questions: PropTypes.any,
  onSubmit: PropTypes.func,
};

module.exports = PersonalityQuizScreen;
