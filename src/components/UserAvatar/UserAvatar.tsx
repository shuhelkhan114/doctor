import Block, { BlockProps } from '@components/Block/Block';
import Image from '@components/Image/Image';
import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';

type AvatarSize = 'small' | 'medium' | 'large';

interface UserAvatarProps extends BlockProps {
  uri?: string;
  size: AvatarSize;
  isOnline?: boolean;
}

const sizeDimensionsMapping: {
  [key in AvatarSize]: number;
} = {
  small: 32,
  medium: 42,
  large: 56,
};

const UserAvatar: React.FC<UserAvatarProps> = (props) => {
  const { size, uri, isOnline, ...restProps } = props;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        avatar: {
          right: 0,
          bottom: 0,
        },
      }),
    []
  );

  return (
    <Block {...restProps}>
      <Image uri={uri} size={sizeDimensionsMapping[size]} circular />
      <Block
        bW={1}
        absolute
        bC="white"
        width={12}
        height={12}
        rounded="xxxl"
        style={styles.avatar}
        bgColor={isOnline ? 'positiveAction' : 'light'}
      />
    </Block>
  );
};

export default UserAvatar;
