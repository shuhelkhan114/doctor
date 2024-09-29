import 'expo-dev-client';
import NewRelic from 'newrelic-react-native-agent';

import Config from 'react-native-config';
import ErrorBoundary from 'react-native-error-boundary';

import Block from '@components/Block/Block';
import Icon from '@components/Icon/Icon';
import Link from '@components/Link/Link';
import Typography from '@components/Typography/Typography';
import { FONTS } from '@core/config/fonts';
import toastConfig from '@core/config/toastConfig';
import { ExtendedTheme } from '@core/lib/react-navigation';
import { queryClient } from '@core/lib/react-query';
import toast from '@core/lib/toast';
import { colors } from '@core/styles/theme';
import { useDynamicLink } from '@hooks/useDynamicLink';
import { useNotification } from '@hooks/useNotification';
import ErrorFallback from '@modules/utils/ErrorFallback/ErrorFallback';
import AuthStack from '@navigation/AuthStack';
import BottomTabs from '@navigation/BottomTabs';
import notifee, { EventType } from '@notifee/react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import TrackPlayer from 'react-native-track-player';
import { QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { TooltipProps, TourGuideProvider } from 'rn-tourguide';
import { Chat, OverlayProvider } from 'stream-chat-expo';
import { ChatProvider } from './src/context/ChatContext';
import { chatClient } from './src/core/lib/stream-chat';
import { requestUserPermission, useChatClient } from './src/hooks/useChatClient';
import {
  fetchAppConfig,
  fetchDoctor,
  fetchPatient,
  refetchDoctor,
  refetchPatient,
} from './src/store/slices/authSlice';
import store, { useAppDispatch, useAppSelector } from './src/store/store';
import { UserRole } from './src/typings/common';

const persistor = persistStore(store);

// TODO: fix this
LogBox.ignoreLogs([
  'AsyncStorage has been extracted from react-native core and will be removed in a future release',
  'Consecutive calls to connectUser is detected, ideally you should only call this function once in your app.',
]);

SplashScreen.preventAutoHideAsync();

const steps = [
  {
    title: 'Invite your patients to join Doc Hello',
    description:
      'This will allow you to easily communicate with them, prescribe meds, share information and others.',
  },
  {
    title: 'Financial incentives for a better healthcare experience.',
    description:
      "We appreciate your support in helping us create a better healthcare experience. To show our gratitude, we offer financial incentives for every patient that you invite to Doc Hello. You'll be contributing to the advancement of healthcare technology, and also be rewarded for your efforts. ",
    footer: 'Thanks for being part of our community!',
  },
  {
    title: 'Let your patients communicate without disrupting your work.',
    description:
      'We offer built-in chat so that you can communicate with patients and other care team members. \n We set your default availability for you, but you can change it at ay time. ',
  },
];

const TooltipComponent: React.FC<TooltipProps> = (props) => {
  const { currentStep, handleNext, handlePrev, isFirstStep, isLastStep, handleStop } = props;

  const step = steps[currentStep.order - 1];
  return (
    <Block bgColor="white" pV="xl" pH="xxxl" rounded="xxl" mB="xxxl" style={{ width: '100%' }}>
      <Typography variation="title3Bolder" color="darker">
        {step?.title}
      </Typography>
      <Typography variation="description1" color="dark" mT="xl">
        {step?.description}
      </Typography>
      {step?.footer && (
        <Typography variation="description1Bolder" color="dark" mT="xl">
          {step?.footer}
        </Typography>
      )}

      <Block mT="xxxl" flexDirection="row" justify="space-between" align="center">
        <Block onPress={!isFirstStep ? handlePrev : undefined}>
          {!isFirstStep && <Icon name="arrow-left" color={colors.mainBlue} size={24} />}
        </Block>
        <Block flexDirection="row">
          {Array.from({ length: steps.length }).map((_, index) => {
            return (
              <Block
                key={index}
                width={8}
                height={8}
                mR="md"
                rounded="xl"
                bgColor={index === currentStep.order - 1 ? 'mainBlue' : 'lighter'}
              />
            );
          })}
        </Block>
        <Block>
          <Link color="mainBlue" onPress={isLastStep ? handleStop : handleNext}>
            {/* TODO: get color from theeme */}
            {isLastStep ? 'FINISH' : 'NEXT'}{' '}
            <Icon name="arrow-right" style={{ marginTop: 100 }} size={24} color={colors.mainBlue} />
          </Link>
        </Block>
      </Block>
    </Block>
  );
};

TrackPlayer.setupPlayer();

notifee.onBackgroundEvent(async ({ detail, type }) => {
  if (type === EventType.PRESS) {
    // user press on notification detected while app was on background on Android
    const channelId = detail.notification?.data?.channel_id;
    if (channelId) {
      //  navigationContainerRef.current?.navigate('ChannelScreen', { channelId });
    }
    await Promise.resolve();
  }
});

const errorHandler = (error: Error, stackTrace: string) => {
  if (Config.NODE_ENV === 'staging') {
    alert(JSON.stringify(error, null, 2));
  }
  NewRelic.recordError(error);
};

const App: React.FC = () => {
  useChatClient();
  useNotification();
  useDynamicLink();
  const netInfo = useNetInfo();
  const [devAlertShown, setDevAlertShown] = useState(false);

  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const [mounted, setMounted] = useState(false);
  const [fontsLoaded] = useFonts(FONTS);

  // INFO: Fetch profile
  const fetchProfile = () => {
    if (auth.loggedIn) {
      if (auth.role === UserRole.Doctor) {
        dispatch(fetchDoctor());
      } else {
        dispatch(fetchPatient());
      }
    }
    dispatch(fetchAppConfig());
  };

  useEffect(() => {
    fetchProfile();
  }, [auth.loggedIn]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
      await requestUserPermission();
      setMounted(true);
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (__DEV__ && !devAlertShown) {
      alert(`App is running in ${Config.NODE_ENV} mode`);
      setDevAlertShown(true);
    }
  }, []);

  useEffect(() => {
    if (
      mounted &&
      auth.loggedIn &&
      (auth.errorFetchingProfile ||
        auth.errorRefetchingProfile ||
        auth.errorFetchingConfig ||
        !netInfo.isConnected ||
        auth.config.medication_frequecny.length < 1)
    ) {
      toast.error(
        'Unable to sync with server, please try again!',
        auth.fetchingProfile || auth.refetchingProfile || auth.fetchingConfig
          ? 'Syncing... '
          : 'Retry',
        () => {
          if (auth.role === UserRole.Patient) {
            dispatch(refetchPatient());
          } else if (auth.role === UserRole.Doctor) {
            dispatch(refetchDoctor());
          }
          dispatch(fetchAppConfig());
        },
        'top',
        60000
      );
    } else {
      Toast.hide();
    }
  }, [
    auth.errorFetchingProfile,
    auth.fetchingProfile,
    auth.errorRefetchingProfile,
    auth.refetchingProfile,
    auth.errorFetchingConfig,
    auth.fetchingConfig,
    auth.patientOnBoardingDone,
    netInfo.isConnected,
    auth.config.medication_frequecny,
    mounted,
  ]);

  if (!fontsLoaded) {
    return <Block />;
  }

  let loggedIn = false;

  if (auth.role === UserRole.Doctor && auth.loggedIn) {
    loggedIn = true;
  } else if (auth.role === UserRole.Patient && auth.loggedIn && auth.patientOnBoardingDone) {
    loggedIn = true;
  }

  return (
    <>
      <Block absolute width="100%" top={0} left={0} zIndex={999999999999999999999}>
        <Toast config={toastConfig} />
      </Block>
      <Block flex1 onLayout={onLayoutRootView}>
        {loggedIn ? <BottomTabs /> : <AuthStack />}
      </Block>
    </>
  );
};

const Root = () => {
  // useEffect(() => {
  //   if (!__DEV__) CodePush.sync({ installMode: CodePush.InstallMode.IMMEDIATE });
  // }, []);

  return (
    <ErrorBoundary onError={errorHandler} FallbackComponent={ErrorFallback}>
      <TourGuideProvider
        maskOffset={0}
        borderRadius={16}
        verticalOffset={0}
        preventOutsideInteraction
        tooltipComponent={TooltipComponent}>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <QueryClientProvider client={queryClient}>
              <SafeAreaProvider>
                <OverlayProvider>
                  <Chat client={chatClient}>
                    <ChatProvider>
                      <NavigationContainer
                        theme={ExtendedTheme}
                        onStateChange={NewRelic.onStateChange}>
                        <App />
                      </NavigationContainer>
                    </ChatProvider>
                  </Chat>
                </OverlayProvider>
              </SafeAreaProvider>
            </QueryClientProvider>
          </PersistGate>
        </Provider>
      </TourGuideProvider>
    </ErrorBoundary>
  );
};

export default Root;
// export default CodePush({ checkFrequency: CodePush.CheckFrequency.ON_APP_START })(Root);
