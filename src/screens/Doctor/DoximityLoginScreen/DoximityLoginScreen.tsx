import Block from '@components/Block/Block';
import RemoteView from '@components/RemoteView/RemoteView';
import { doximityConfig } from '@core/config/app';
import { asyncStorageKeys } from '@core/config/asyncStorage';
import { Screens } from '@core/config/screens';
import API from '@core/services';
import { getErrorMessage } from '@core/utils/apiError';
import { logError } from '@core/utils/logger';
import { AuthStackScreens } from '@navigation/AuthStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fetchDoctor, refetchDoctor } from '@store/slices/authSlice';
import { useAppDispatch } from '@store/store';
import { AxiosError } from 'axios';
import { useState } from 'react';
import Config from 'react-native-config';

type DoximityLoginScreenProps = NativeStackScreenProps<
  AuthStackScreens,
  Screens.DoximityLoginScreen
>;

interface OAuthResponse {
  success: boolean;
  code?: string;
  message?: string;
}

const DoximityLoginScreen: React.FC<DoximityLoginScreenProps> = (props) => {
  const { navigation } = props;
  const [emailFromWebView, setEmailFromWebView] = useState('');
  const dispatch = useAppDispatch();

  const handleMessage = async (data: string) => {
    try {
      const oAuthResponse = JSON.parse(data) as OAuthResponse;
      if ((oAuthResponse as any).email) {
        setEmailFromWebView((oAuthResponse as any).email);
      } else {
        const { code } = oAuthResponse;
        if (oAuthResponse.success) {
          // Grab auth token from Doximity
          const tokenResponse = await API.doctor.doximity.getOAuthToken(code!);
          const { access_token } = tokenResponse;
          // Grab doctor info from doximity
          const doximityDoctorResponse = await API.doctor.doximity.getUserInfo(access_token);

          // Try to perform login to Doc Hello server
          API.doctor.auth
            .doctorLogin({
              username: doximityDoctorResponse.sub,
              password: doximityDoctorResponse.token,
            })
            .then(async (loginResponse) => {
              const { access_token, refresh_token } = loginResponse;
              await AsyncStorage.setItem(
                asyncStorageKeys.DOCTOR_TOKENS,
                JSON.stringify({
                  accessToken: access_token,
                  refreshToken: refresh_token,
                })
              );
              // If the user exits
              const token = await messaging().getToken();
              await API.doctor.auth.updateProfile({
                device_tokens: [token],
              });
              dispatch(fetchDoctor());
            })
            .catch(async (error) => {
              logError(error);
              // IF the user doesn't exists
              if (error instanceof AxiosError || error.response?.status === 404) {
                try {
                  const token = await messaging().getToken();
                  const signUpResponse = await API.doctor.auth.doctorSignUp({
                    first_name: doximityDoctorResponse.given_name,
                    last_name: doximityDoctorResponse.family_name,
                    doximity_id: doximityDoctorResponse.sub,
                    doximity_secret: doximityDoctorResponse.token,
                    email: emailFromWebView,
                    speciality: doximityDoctorResponse.specialty,
                    doctor_image: doximityDoctorResponse.profile_photo_url,
                    device_tokens: [token],
                  });

                  await AsyncStorage.setItem(
                    asyncStorageKeys.DOCTOR_TOKENS,
                    JSON.stringify({
                      accessToken: signUpResponse.access_token,
                    })
                  );
                  dispatch(refetchDoctor());
                } catch (error) {
                  logError(error);
                  const errorMessage = getErrorMessage(error);
                  navigation.replace(Screens.DoximityLoginErrorScreen, {
                    message: errorMessage,
                  });
                }
              } else {
                const errorMessage = getErrorMessage(error);
                navigation.replace(Screens.DoximityLoginErrorScreen, {
                  message: errorMessage,
                });
              }
            });
        } else {
          navigation.replace(Screens.DoximityLoginErrorScreen, {
            message: oAuthResponse.message,
          });
        }
      }
    } catch (error) {
      logError(error);
      const errorMessage = getErrorMessage(error);
      navigation.replace(Screens.DoximityLoginErrorScreen, { message: errorMessage });
    }
  };

  return (
    <Block flex1>
      <RemoteView
        uri={doximityConfig.getOAuthUrl()}
        incognito
        onMessage={handleMessage}
        injectedJavascript={`
          const emailField = document.querySelector('#login');
          const signInButton = document.querySelector('#signinbutton');
          signInButton.addEventListener('click', () => {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              email: emailField.value,
            }))
          })

          ${
            Config.WEBVIEW_TMP_FIX === 'yes' || __DEV__
              ? `
          emailField.value = 'benjamin.bergman@gmail.com';
          document.querySelector('#password').value = '123ComboCombo***';
          `
              : ''
          }
          
          ${Config.WEBVIEW_TMP_FIX === 'yes' ? `signInButton.click();` : ''}
          
        `}
        // INFO: Above code is a temporary fix for the webview not being able to click the sign in button until detox releases a stable version
      />
    </Block>
  );
};

export default DoximityLoginScreen;
