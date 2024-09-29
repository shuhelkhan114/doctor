import React, { useMemo } from 'react';
import { Dimensions, ImageBackground, StatusBar, StyleSheet } from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ResizeMode, Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';

import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import Link from '@components/Link/Link';
import NavigationBar from '@components/NavigationBar/NavigationBar';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import { gradientColors } from '@core/styles/theme';
import { getSize } from '@core/utils/responsive';
import useAppTheme from '@hooks/useTheme';
import { AuthStackScreens } from '@navigation/AuthStack';

type GaeaWelcomeScreenProps = NativeStackScreenProps<AuthStackScreens, Screens.GaeaWelcomeScreen>;

export type GaeaWelcomeScreenParams = undefined;

const GaeaWelcomeScreen: React.FC<GaeaWelcomeScreenProps> = (props) => {
  const { navigation } = props;

  const theme = useAppTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        background: {
          marginTop: '-15%',
          width: Dimensions.get('screen').width,
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: theme.spacing['6xl'],
        },
        video: {
          width: getSize(260),
          height: getSize(260),
          marginBottom: theme.spacing.xl,
        },
        button: {
          backgroundColor: 'black',
        },
        myChartIcon: {
          height: 17,
          width: 54,
          marginLeft: 2,
        },
      }),
    []
  );

  return (
    <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <NavigationBar variation="onboarding" title="" />

      <Block pH="6xl" mT="6xl">
        <Typography variation="title2" center>
          My name is <Typography variation="title2Bolder">Gaea</Typography>, your personal
          assistant. I am here to help you get the most out of Doc Hello
        </Typography>
      </Block>

      <ImageBackground
        resizeMode="contain"
        style={styles.background}
        source={require('@assets/gaea-screen-bg.png')}>
        <Video
          isLooping
          shouldPlay
          style={styles.video}
          useNativeControls={false}
          resizeMode={ResizeMode.CONTAIN}
          source={require('@assets/gaea-video.mp4')}
        />
        <Button
          icon="my-chart"
          title="Grab it from"
          iconPosition="right"
          style={styles.button}
          iconStyle={styles.myChartIcon}
          onPress={() => navigation.navigate(Screens.FHIRProviderSelectionScreen)}
        />
        <Link
          color="white"
          variation="description1Bolder"
          mT="xl"
          onPress={() =>
            navigation.navigate(Screens.MedicationSelectionScreen, { isManualSignup: true })
          }>
          Add information manually
        </Link>
      </ImageBackground>
    </LinearGradient>
  );
};

export default GaeaWelcomeScreen;
