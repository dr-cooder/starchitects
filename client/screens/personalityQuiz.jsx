const React = require('react');
const PropTypes = require('prop-types');

const PersonalityQuizScreen = ({ questions, onSubmit }) => (
  <>
    <p>{questions}</p>
    <button onClick={() => onSubmit({
      sampleQuestion: 'Sample Answer',
    })}>Submit</button>
  </>
);

PersonalityQuizScreen.propTypes = {
  questions: PropTypes.any,
  onSubmit: PropTypes.func,
};

module.exports = PersonalityQuizScreen;
