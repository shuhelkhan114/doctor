import React, { PropsWithChildren, useMemo } from 'react';

import Block from '@components/Block/Block';
import Image from '@components/Image/Image';
import useAppTheme from '@hooks/useTheme';
import { ImageBackground, StatusBar, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PrimaryNavigationBarProps extends PropsWithChildren {}

const PrimaryNavigationBar: React.FC<PrimaryNavigationBarProps> = (props) => {
  const { children } = props;

  const insets = useSafeAreaInsets();
  const theme = useAppTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: theme.colors.mainBlue,
          width: '100%',
          overflow: 'hidden',
          zIndex: 1,
        },
        background: {
          top: 0,
          left: 0,
          zIndex: 99,
          opacity: 0.4,
          width: '100%',
          position: 'absolute',
          paddingTop: insets.top,
        },
      }),
    []
  );

  return (
    <ImageBackground style={styles.container} source={require('@assets/header-gradient-bg.png')}>
      <StatusBar barStyle="light-content" />
      <Image
        resizeMode="stretch"
        imageStyle={styles.background}
        source={require('@assets/header-bg.png')}
      />
      <Block style={{ paddingTop: insets.top }}>{children}</Block>
    </ImageBackground>
  );
};

export default PrimaryNavigationBar;
