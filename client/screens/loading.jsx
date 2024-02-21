const React = require('react');
const { useState, useEffect } = require('react');
const PropTypes = require('prop-types');
const { percent } = require('../../common/helpers.js');
const { preload } = require('../preload.js');
const { unitsVerticalInner } = require('../scalingMeasurements.js');
const { ScalingSection } = require('../components');

const height = 128;

const top = (unitsVerticalInner - height) / 2;

const LoadingScreen = ({ onLoad }) => {
  const [progress, setProgress] = useState('(no measurable progress)');
  useEffect(() => {
    preload((currentProgress) => setProgress(
      currentProgress == null ? '(no measurable progress)' : percent(currentProgress),
    ))
      .then(onLoad)
      .catch((message) => {
        setProgress(`ERROR: ${message}`);
      });
  }, []);
  return (
    <ScalingSection
      topUnits={top}
      topFreeSpace={0.5}
      heightUnits={height}
    >
      <div className='centeredText'>
        <p>Loading assets...</p>
        <p>(Pretend the spinner from the comps is here)</p>
        <p>{progress}</p>
      </div>
    </ScalingSection>
  );
};

LoadingScreen.propTypes = {
  blobSources: PropTypes.object,
  onLoad: PropTypes.func,
};

module.exports = LoadingScreen;
