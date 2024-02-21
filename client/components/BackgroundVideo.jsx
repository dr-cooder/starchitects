const React = require('react');
const { useEffect, createRef } = require('react');
const PropTypes = require('prop-types');
const { Background } = require('.');
const { px } = require('../../common/helpers');
const { useGridMeasurements } = require('../scalingMeasurements.js');

const BackgroundVideo = ({
  blur, darkness, poster, sources, children,
}) => {
  const { pixelsPerUnit } = useGridMeasurements();
  // Some browsers are very stubborn about autoplay,
  // hence this otherwise redundant failsafe
  const videoRef = createRef();
  useEffect(() => {
    videoRef.current.play();
  }, []);
  return (
    <Background
      background={
        <video
          ref={videoRef}
          className='background'
          style={{ filter: blur && `blur(${px(pixelsPerUnit * blur)})` }}
          autoPlay={true}
          loop={true}
          muted={true}
          poster={poster}
        >
          {sources.map((source, index) => (
            <source key={index} src={source.src} type={source.type}/>
          ))}
        </video>
      }
      darkness={darkness}
    >
      {children}
    </Background>
  );
};

BackgroundVideo.propTypes = {
  blur: PropTypes.number,
  darkness: PropTypes.number,
  poster: PropTypes.string,
  sources: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node.isRequired),
    PropTypes.node,
  ]),
};

module.exports = BackgroundVideo;
