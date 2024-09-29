import { useNavigation } from '@react-navigation/native';
import { PropsWithChildren, useCallback, useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import LogoHorizontalWhite from '@components/Icons/LogoHorizontalWhite';
import { getSize } from '@core/utils/responsive';
import useAppTheme from '@hooks/useTheme';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Block from '../Block/Block';
import Icon from '../Icon/Icon';

interface HeaderProps extends PropsWithChildren {
  goBack?: boolean;
  height?: number | 'auto';
  secondaryContent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = (props) => {
  const { goBack = true, secondaryContent, children, height = 18 } = props;
  const theme = useAppTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          height: height === 'auto' ? undefined : RFPercentage(height),
          backgroundColor: theme.colors.mainBlue,
        },
        gradient: {
          width: '100%',
          height: '100%',
          flex: 1,
          position: 'absolute',
          top: 0,
          left: 0,
        },
        background: {
          width: '100%',
          height: '100%',
          flex: 1,
          zIndex: 1,
          top: 0,
          left: 0,
          position: 'absolute',
        },
        contentContainer: {
          paddingTop: insets.top,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '70%',
          zIndex: 2,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: getSize(40),
          justifyContent: 'space-between',
        },
        logoContainer: {
          position: 'absolute',
          top: 0,
          zIndex: 2,
          left: 0,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        },
      }),
    []
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <View style={styles.container}>
      <Image style={styles.background} source={require('@assets/header-bg.png')} />
      <Image style={styles.gradient} source={require('@assets/header-gradient-bg.png')} />

      {children ? (
        <Block zIndex={5} style={{ paddingTop: insets.top }}>
          {children}
        </Block>
      ) : (
        <>
          <Block style={styles.logoContainer}>
            <Block mT="xxl">
              <LogoHorizontalWhite />
            </Block>
          </Block>
          <Block style={styles.contentContainer}>
            <Block onPress={goBack ? handleGoBack : () => {}}>
              {goBack && <Icon name="arrow-left" size={28} />}
            </Block>
            <Block>{secondaryContent ? secondaryContent : <></>}</Block>
          </Block>
        </>
      )}
    </View>
  );
};

export default Header;
