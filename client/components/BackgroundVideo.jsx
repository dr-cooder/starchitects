const React = require('react');
const { useEffect, useRef } = require('react');
const PropTypes = require('prop-types');
const { Background } = require('.');

// TODO: This is likely obsolete
const BackgroundVideo = ({
  poster, sources, children,
}) => {
  // Some browsers are very stubborn about autoplay,
  // hence this otherwise redundant failsafe
  const videoRef = useRef();
  useEffect(() => {
    videoRef.current.play();
  }, []);
  return (
    <Background
      background={
        <video
          ref={videoRef}
          className='background'
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
    >
      {children}
    </Background>
  );
};

BackgroundVideo.propTypes = {
  poster: PropTypes.string,
  sources: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node.isRequired),
    PropTypes.node,
  ]),
};

module.exports = BackgroundVideo;
