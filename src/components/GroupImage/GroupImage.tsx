import React from 'react';

import Block, { BlockProps } from '@components/Block/Block';
import Image from '@components/Image/Image';

interface GroupImageProps extends BlockProps {
  size?: number;
  images: string[];
}

const GroupImage: React.FC<GroupImageProps> = (props) => {
  const { images, size = 56, ...restProps } = props;

  const halfSize = size / 2;

  const count = images.length;

  return (
    <Block width={size} height={size} rounded="6xl" overflow="hidden" {...restProps}>
      <Block flexDirection="row">
        <Image
          width={count >= 3 ? halfSize : size}
          height={count >= 2 ? halfSize : size}
          uri={images[0]}
        />
        {images[2] && <Image width={halfSize} size={halfSize} uri={images[2]} />}
      </Block>
      <Block flexDirection="row">
        <Image
          width={count >= 4 ? halfSize : size}
          height={count >= 2 ? halfSize : size}
          uri={images[1]}
        />
        {images[3] && <Image width={halfSize} height={halfSize} uri={images[3]} />}
      </Block>
    </Block>
  );
};

export default GroupImage;
