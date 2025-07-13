import React from 'react';

const MemoizedImage = React.memo(({ src, alt, className }) => {
  return <img src={src} alt={alt} className={className} loading="lazy" />;
});

export default MemoizedImage;
