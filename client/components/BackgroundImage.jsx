const React = require('react');
const PropTypes = require('prop-types');
const { Background } = require('.');

const BackgroundImage = ({
  alt, blur, darkness, src, children,
}) => (
    <Background
      background={
        <img
          className='background'
          alt={alt ?? 'Background image'}
          src={src}
        />
      }
      blur={blur}
      darkness={darkness}
    >
      {children}
    </Background>
);

BackgroundImage.propTypes = {
  alt: PropTypes.string,
  blur: PropTypes.number,
  darkness: PropTypes.number,
  src: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node.isRequired),
    PropTypes.node,
  ]),
};

module.exports = BackgroundImage;
