import React from 'react';

type Props = {
    src: string;
};

const NextImage = ({ src }: Props) => {
  return (
    <div style={{ backgroundImage: `url(${src})` }} className='h-full w-full'></div>
  );
};
    
export default NextImage;