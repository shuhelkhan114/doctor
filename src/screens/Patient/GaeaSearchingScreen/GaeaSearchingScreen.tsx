import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Video } from 'expo-av';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';

import Block from '@components/Block/Block';
import NavigationBar from '@components/NavigationBar/NavigationBar';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import { AuthStackScreens } from '@navigation/AuthStack';
import { donePatientOnBoarding, refetchPatient } from '@store/slices/authSlice';
import { useAppDispatch } from '@store/store';

type GaeaSearchingScreenProps = NativeStackScreenProps<
  AuthStackScreens,
  Screens.GaeaSearchingScreen
>;

export type GaeaSearchingScreenParams = {
  title: string;
  nextScreen: string;
  description: string;
  setOnboardingDone?: boolean;
};

const GaeaSearchingScreen: React.FC<GaeaSearchingScreenProps> = (props) => {
  const { navigation, route } = props;
  const { title, nextScreen, description, setOnboardingDone } = route.params || {};

  const dispatch = useAppDispatch();

  useEffect(() => {
    navigation.addListener('focus', () => {
      StatusBar.setBarStyle('dark-content');
    });
  }, [navigation]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (setOnboardingDone) {
        dispatch(refetchPatient());
        dispatch(donePatientOnBoarding());
      } else {
        navigation.replace(nextScreen as any);
      }
    }, 3000);
    return () => {
      return clearTimeout(timeout);
    };
  }, []);

  return (
    <Block bgColor="mainBlue" style={{ flex: 1, backgroundColor: '#0B4CFF' }}>
      <NavigationBar variation="onboarding2" title={title} />

      <Block justify="center" align="center" style={{ flex: 1 }}>
        <Video
          isLooping
          shouldPlay
          useNativeControls={false}
          style={{ width: 300, height: 300 }}
          source={require('@assets/gaea-video.mp4')}
        />
        <Typography center color="white" style={{ width: '60%' }} variation="title1">
          {description}
        </Typography>
      </Block>
    </Block>
  );
};

export default GaeaSearchingScreen;
