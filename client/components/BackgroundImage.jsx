const React = require('react');
const PropTypes = require('prop-types');
const { Background } = require('.');

// TODO: This is likely obsolete
const BackgroundImage = ({
  alt, src, children,
}) => (
    <Background
      background={
        <img
          draggable={false}
          className='background'
          alt={alt ?? 'Background image'}
          src={src}
        />
      }
    >
      {children}
    </Background>
);

BackgroundImage.propTypes = {
  alt: PropTypes.string,
  src: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node.isRequired),
    PropTypes.node,
  ]),
};

module.exports = BackgroundImage;
