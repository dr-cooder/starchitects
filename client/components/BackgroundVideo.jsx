const React = require('react');
const { useEffect, createRef } = require('react');
const PropTypes = require('prop-types');
const { Background } = require('.');

const BackgroundVideo = ({
  blur, darkness, poster, sources, children,
}) => {
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
      blur={blur}
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
