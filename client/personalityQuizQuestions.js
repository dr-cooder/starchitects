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

module.exports = { questions, questionCount, percentPerQuestion };
