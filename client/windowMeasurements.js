// https://codesandbox.io/p/sandbox/34kr2rw285
const { useEffect, useState } = require('react');

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

const getWindowMeasurements = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
};

const useWindowMeasurements = makeResizeListener(getWindowMeasurements);

module.exports = { makeResizeListener, getWindowMeasurements, useWindowMeasurements };
