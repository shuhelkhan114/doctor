import { getSize } from '@core/utils/responsive';
import React, { useMemo } from 'react';
import {
  ImageResizeMode,
  ImageSourcePropType,
  ImageStyle,
  Image as NativeImage,
  StyleSheet,
} from 'react-native';
import Block, { BlockProps } from '../Block/Block';

interface ImageProps extends BlockProps {
  size?: number;
  width?: number;
  height?: number;
  circular?: boolean;
  source?: ImageSourcePropType;
  uri?: string;
  resizeMode?: ImageResizeMode;
  imageStyle?: ImageStyle;
}

const Image: React.FC<ImageProps> = (props) => {
  const { size, width, height, circular, source, uri, resizeMode, imageStyle, ...restProps } =
    props;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        default: {
          ...(size && { width: getSize(size), height: getSize(size) }),
          ...(width && { width: getSize(width) }),
          ...(height && { height: getSize(height) }),
          ...(circular && { borderRadius: size }),
          ...imageStyle,
        },
      }),
    [circular, size, width, height, imageStyle]
  );

  return (
    <Block {...restProps}>
      <NativeImage
        defaultSource={require('@assets/fallback.png')}
        source={uri ? { uri } : source}
        resizeMode={resizeMode}
        style={styles.default}
      />
    </Block>
  );
};

export default Image;
