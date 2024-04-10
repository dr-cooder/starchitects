const { images, videos } = require('./preload.js');

const {
  thinker1: thinker1Img,
  thinker2: thinker2Img,
  thinker3: thinker3Img,
  dreamer1: dreamer1Img,
  dreamer2: dreamer2Img,
  dreamer3: dreamer3Img,
  producer1: producer1Img,
  producer2: producer2Img,
  producer3: producer3Img,
  disciplined1: disciplined1Img,
  disciplined2: disciplined2Img,
  disciplined3: disciplined3Img,
  innovator1: innovator1Img,
  innovator2: innovator2Img,
  innovator3: innovator3Img,
  visionary1: visionary1Img,
  visionary2: visionary2Img,
  visionary3: visionary3Img,
  independent1: independent1Img,
  independent2: independent2Img,
  independent3: independent3Img,
  listener1: listener1Img,
  listener2: listener2Img,
  listener3: listener3Img,
} = images;

const {
  thinker1: thinker1Vid,
  thinker2: thinker2Vid,
  thinker3: thinker3Vid,
  dreamer1: dreamer1Vid,
  dreamer2: dreamer2Vid,
  dreamer3: dreamer3Vid,
  producer1: producer1Vid,
  producer2: producer2Vid,
  producer3: producer3Vid,
  disciplined1: disciplined1Vid,
  disciplined2: disciplined2Vid,
  disciplined3: disciplined3Vid,
  innovator1: innovator1Vid,
  innovator2: innovator2Vid,
  innovator3: innovator3Vid,
  visionary1: visionary1Vid,
  visionary2: visionary2Vid,
  visionary3: visionary3Vid,
  independent1: independent1Vid,
  independent2: independent2Vid,
  independent3: independent3Vid,
  listener1: listener1Vid,
  listener2: listener2Vid,
  listener3: listener3Vid,
} = videos;

const starchetypes = [
  {
    name: 'Chess',
    tagline: 'The Thinker',
    description: 'You bridge the perspectives between theory and practice. You are a perpetual student, with a strong sense of wonder and depth in thinking.',
    dustTypeImages: [
      thinker1Img,
      thinker2Img,
      thinker3Img,
    ],
    dustTypeVideos: [
      thinker1Vid,
      thinker2Vid,
      thinker3Vid,
    ],
  },
  {
    name: 'Balloon',
    tagline: 'The Dreamer',
    description: 'You are naturally curious with an unwavering sense of optimism, approaching life with a sense of wonder. You are always asking questions and seeking answers.',
    dustTypeImages: [
      dreamer1Img,
      dreamer2Img,
      dreamer3Img,
    ],
    dustTypeVideos: [
      dreamer1Vid,
      dreamer2Vid,
      dreamer3Vid,
    ],
  },
  {
    name: 'Appliance',
    tagline: 'The Producer',
    description: 'Your process of creating things is powerful. You like to be realistic and get things done, balancing productivity with purpose.',
    dustTypeImages: [
      producer1Img,
      producer2Img,
      producer3Img,
    ],
    dustTypeVideos: [
      producer1Vid,
      producer2Vid,
      producer3Vid,
    ],
  },
  {
    name: 'Bonsai',
    tagline: 'The Disciplined',
    description: 'You are focused on dedication, the ability to achieve mastery of your discipline, and manifesting ideas.',
    dustTypeImages: [
      disciplined1Img,
      disciplined2Img,
      disciplined3Img,
    ],
    dustTypeVideos: [
      disciplined1Vid,
      disciplined2Vid,
      disciplined3Vid,
    ],
  },
  {
    name: 'Geode',
    tagline: 'The Innovator',
    description: 'You are a big experimentalist. You take current ideas and execute improvements and new ways, thinking outside the box.',
    dustTypeImages: [
      innovator1Img,
      innovator2Img,
      innovator3Img,
    ],
    dustTypeVideos: [
      innovator1Vid,
      innovator2Vid,
      innovator3Vid,
    ],
  },
  {
    name: 'Duck',
    tagline: 'The Visionary',
    description: 'You are full of big ideas, able to find potential in everything. You are charismatic and very expressive about sharing and contributing ideas that can come to life.',
    dustTypeImages: [
      visionary1Img,
      visionary2Img,
      visionary3Img,
    ],
    dustTypeVideos: [
      visionary1Vid,
      visionary2Vid,
      visionary3Vid,
    ],
  },
  {
    name: 'Jet',
    tagline: 'The Independent',
    description: 'You are independent, marching to the beat of your own drum. You have a fearless approach to creativity.',
    dustTypeImages: [
      independent1Img,
      independent2Img,
      independent3Img,
    ],
    dustTypeVideos: [
      independent1Vid,
      independent2Vid,
      independent3Vid,
    ],
  },
  {
    name: 'Radio',
    tagline: 'The Listener',
    description: 'You like to listen. You have an open mind, are curious of other people\'s perspectives, and are a heavy empathizer',
    dustTypeImages: [
      listener1Img,
      listener2Img,
      listener3Img,
    ],
    dustTypeVideos: [
      listener1Vid,
      listener2Vid,
      listener3Vid,
    ],
  },
];

module.exports = { starchetypes };
