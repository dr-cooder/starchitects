const React = require('react');
const { useState } = require('react');
const PropTypes = require('prop-types');
const { questions, percentPerQuestion } = require('../personalityQuizQuestions.js');
const { unitsHorizontalInnerHalf, unitsVerticalInner } = require('../measurements.js');
const { Inert, ScalingSection } = require('../components');
const { misc: { progressStar }, getBlob } = require('../preload.js');
const { percent, preventChildrenFromCalling } = require('../../common/helpers.js');

const questionHeight = 116;
const answerButtonHeight = 64;

const questionTop = (unitsVerticalInner - questionHeight - answerButtonHeight) / 2;
const answerButtonTop = questionTop + questionHeight;

const animationClassNames = {
  goingIn: {
    questionBlock: 'questionBlockIn',
  },
  idle: {
    questionBlock: 'questionBlockIn',
  },
  goingOut: {
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
    goingIn, idle, goingOut,
  } = animationClassNames;
  const [questionsDone, setQuestionsDone] = useState(0);
  const [animationClassName, setAnimationClassName] = useState(goingIn);
  const {
    questionBlock: quesionBlockClassName,
  } = animationClassName;
  const [currentQuestion, setCurrentQuestion] = useState(questions.askYourself);
  const [currentAnswer, setCurrentAnswer] = useState(undefined);
  const [answerList, setAnswerList] = useState('');
  const [outerClassName, setOuterClassName] = useState('quizFadeIn');
  const registerAnswer = (answerId) => {
    setCurrentAnswer(answerId);
    setAnswerList(answerList + answerId);
    setQuestionsDone(questionsDone + 1);
    setAnimationClassName(goingOut);
  };
  // useEffect(nextBackground, []);
  return (
    <div
      className={outerClassName}
      onAnimationEnd={outerClassName === 'quizFadeOut' ? preventChildrenFromCalling(() => onSubmit(answerList)) : undefined}
    >
      <Inert inert={animationClassName !== idle}>
        <div className='quizProgressIn'>
          <ScalingSection heightUnits={0}>
            <div className='quizProgress'>
              <div className='quizProgressPercent' style={{
                width: percent(percentPerQuestion * questionsDone),
              }}>
                <div className='quizProgressBar'></div>
                <img draggable={false} src={getBlob(progressStar)} alt='Progress star' className='quizProgressStar'/>
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
                setCurrentAnswer(undefined);
                setAnimationClassName(goingIn);
              } else {
                setOuterClassName('quizFadeOut');
              }
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
    </div>
  );
};

PersonalityQuizScreen.propTypes = {
  questions: PropTypes.any,
  onSubmit: PropTypes.func,
};

module.exports = PersonalityQuizScreen;
