// https://codesandbox.io/p/sandbox/34kr2rw285
const { useEffect, useState } = require('react');
const { getGridMeasurements, getPixelsPerUnit, getWindowMeasurements } = require('./measurements.js');

const makeResizeListener = (measurementGetter) => () => {
  const [measurements, setMeasurements] = useState(measurementGetter());

  useEffect(() => {
    const handleResize = () => {
      setMeasurements(measurementGetter());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return measurements;
};

const useGridMeasurements = makeResizeListener(getGridMeasurements);

const usePixelsPerUnit = makeResizeListener(getPixelsPerUnit);

const useWindowMeasurements = makeResizeListener(getWindowMeasurements);

module.exports = { useGridMeasurements, usePixelsPerUnit, useWindowMeasurements };
