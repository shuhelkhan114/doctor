import { NativeStackScreenProps } from '@react-navigation/native-stack';

import Block from '@components/Block/Block';
import RemoteView from '@components/RemoteView/RemoteView';
import { fhirConfig } from '@core/config/app';
import { Screens } from '@core/config/screens';
import { fhirInstance } from '@core/lib/axios';
import { logError } from '@core/utils/logger';
import { AuthStackScreens } from '@navigation/AuthStack';
import { setFHIRPatientId } from '@store/slices/patientOnboardingSlice';
import { useAppDispatch } from '@store/store';
import { FHIROAuthResponse } from '@typings/api-responses/fhir/oauth';
import { useState } from 'react';
import Config from 'react-native-config';
import { WebViewNavigation } from 'react-native-webview';

type FHIRLoginScreenProps = NativeStackScreenProps<AuthStackScreens, Screens.FHIRLoginScreen>;

export type FHIRLoginScreenParams = {
  provider: string;
};

const FHIRLoginScreen: React.FC<FHIRLoginScreenProps> = (props) => {
  const {
    navigation,
    route: { params = {} as FHIRLoginScreenParams },
  } = props;
  const { provider } = params;

  const [injectedJs, setInjectedJs] = useState('');

  const dispatch = useAppDispatch();

  const handleMessage = async (data: string) => {
    try {
      const res = JSON.parse(data) as FHIROAuthResponse;
      if (res.success) {
        fhirInstance.defaults.headers.common.Authorization = `Bearer ${res.data.access_token}`;
        dispatch(setFHIRPatientId(res.data.patientId));
        navigation.replace(Screens.MedicationSelectionScreen);
      } else {
        navigation.replace(Screens.FHIRLoginErrorScreen, {
          message: 'Unable to login with MyChart. Please try again.',
        });
      }
    } catch (error) {
      logError(error);
      navigation.replace(Screens.FHIRLoginErrorScreen, {
        message: 'Unable to login with MyChart. Please try again.',
      });
    }
  };

  const handleNavigationStateChange = (event: WebViewNavigation) => {
    if (__DEV__) {
      const url = new URL(event.url);
      const { pathname } = url;
      if (pathname === '/MyChart/Authentication/Login') {
        setInjectedJs(`
        window.addEventListener('load', function () {
          const usernameInput = document.querySelector('#Login');
          const passwordInput = document.querySelector('#Password');
          const submitButton = document.querySelector('#submit');
    
          usernameInput.value = 'rehan232001@gmail.com';
          passwordInput.value = 'Romo23!!!';
          ${Config.WEBVIEW_TMP_FIX === 'yes' ? `submitButton.click();` : ''}
        })
      `);

        // INFO: Above code is a temporary fix for the webview not being able to click the sign in button until detox releases a stable version
      } else if (pathname === '/MyChart/Authentication/OAuth/Authorize') {
        setInjectedJs(`
          window.addEventListener('load', function () {
            const nextButton = document.querySelector('#nextButton');
            nextButton.click();
            setTimeout(() => {
              const allowButton = document.querySelector('#allowDataSharing');
              allowButton.click();
            }, 200)
          })
        `);
      }
    }
  };

  return (
    <Block flex1>
      <RemoteView
        incognito
        onMessage={handleMessage}
        injectedJavascript={injectedJs}
        onNavigationStateChange={handleNavigationStateChange}
        uri={`https://dochello.surge.sh?client_id=${fhirConfig.clientId}&org_id=${provider}`}
      />
    </Block>
  );
};

export default FHIRLoginScreen;
