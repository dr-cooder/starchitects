const React = require('react');
const { useRef, useState } = require('react');
const PropTypes = require('prop-types');
const { unitsHorizontalInnerHalf, unitsVerticalInner } = require('../measurements.js');
const {
  Background, Inert, ScalingSection, VideoSequence,
} = require('../components');
const { videos, misc } = require('../preload.js');
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

const questionCount = 5;
const percentPerQuestion = 100 / questionCount;

const questions = {
  askYourself: {
    text: 'What\'s the first question you ask yourself?',
    answers: [
      {
        text: 'Why am I here?',
        next: 'timeMachine',
      },
      {
        text: 'Where will I go?',
        next: 'timeMachine',
      },
    ],
  },
  timeMachine: {
    text: 'What would you do with a time machine?',
    answers: [
      {
        text: 'Ride a dinosaur.',
        next: 'newIdea',
      },
      {
        text: 'Befriend a robot.',
        next: 'newIdea',
      },
    ],
  },
  newIdea: {
    text: 'What do you do when you have a new idea?',
    answers: [
      {
        text: 'Organize your thoughts.',
        next: 'success',
      },
      {
        text: 'Try it out, immediately.',
        next: 'theseus',
      },
    ],
  },
  success: {
    text: 'What is the secret to success?',
    answers: [
      {
        text: 'Stay curious.',
        next: 'beInFuture',
      },
      {
        text: 'Always moving forward.',
        next: 'superhero',
      },
    ],
  },
  theseus: {
    text: 'Is a repaired boat, with entirely new parts, the same boat?',
    answers: [
      {
        text: 'Yes, they are the same.',
        next: 'paintings',
      },
      {
        text: 'No, they are different.',
        next: 'newTask',
      },
    ],
  },
  beInFuture: {
    text: 'What would you rather be in the future?',
    answers: [
      {
        text: 'Astronaut',
      },
      {
        text: 'Wizard',
      },
    ],
  },
  superhero: {
    text: 'If you were a superhero, what would your ability be?',
    answers: [
      {
        text: 'Utility Belt',
      },
      {
        text: 'Control over one chosen element.',
      },
    ],
  },
  paintings: {
    text: 'You enjoy paintings that are more…',
    answers: [
      {
        text: 'Realistic and capture details.',
      },
      {
        text: 'Surreal and imaginative.',
      },
    ],
  },
  newTask: {
    text: 'When working on new task, you want to…',
    answers: [
      {
        text: 'Get the work done.',
      },
      {
        text: 'Learn something new.',
      },
    ],
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
                el: start.el,
                className: `background${index === 0 ? '' : ' quizBackgroundNextStart'}`,
                onEnd: () => {
                  setAnimationClassName(goingIn);
                  nextBackground();
                },
              },
              {
                el: loop.el,
                className: 'background quizBackgroundLoop',
              },
            ]).flat(),
            {
              el: quizBgEnd.el,
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
