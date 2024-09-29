import { logError } from '@core/utils/logger';
import messaging from '@react-native-firebase/messaging';
import { useEffect, useRef, useState } from 'react';

import { chatClient } from '@core/lib/stream-chat';
import toast from '@core/lib/toast';
import { useAppSelector } from '@store/store';
import { UserRole } from '@typings/common';
import { PermissionsAndroid, Platform } from 'react-native';

export const requestUserPermission = async () => {
  try {
    if (Platform.OS === 'ios') {
      await messaging().requestPermission();
    } else {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }
  } catch (error) {
    logError(error);
    toast.error('Unable to request permission, please turn in on manually');
  }
};

export const useChatClient = () => {
  const unsubscribeTokenRefreshListenerRef = useRef<() => void>();
  const [clientIsReady, setClientIsReady] = useState(false);
  const loggedIn = useAppSelector((state) => state.auth.loggedIn);

  const { role, doctor, patient } = useAppSelector((state) => ({
    role: state.auth.role,
    doctor: state.auth.doctor,
    patient: state.auth.patient,
  }));

  const registerPushToken = async (userId: string) => {
    unsubscribeTokenRefreshListenerRef.current?.();
    const token = await messaging().getToken();
    const push_provider = 'firebase';
    const push_provider_name = 'DocHelloProd';

    chatClient.addDevice(token, push_provider, userId, push_provider_name);

    // chatClient.setLocalDevice({
    //   id: token,
    //   push_provider,
    //   push_provider_name,
    // });

    // await AsyncStorage.setItem(asyncStorageKeys.DEVICE_TOKEN, token);

    // const removeOldToken = async () => {
    //   const oldToken = await AsyncStorage.getItem(asyncStorageKeys.DEVICE_TOKEN);
    //   if (oldToken !== null) await chatClient.removeDevice(oldToken);
    // };

    unsubscribeTokenRefreshListenerRef.current = messaging().onTokenRefresh(async (newToken) => {
      await Promise.all([
        // removeOldToken(),
        chatClient.addDevice(newToken, push_provider, userId, push_provider_name),
        // AsyncStorage.setItem(asyncStorageKeys.DEVICE_TOKEN, newToken),
      ]);
    });
  };

  const setupClient = async () => {
    try {
      // if (chatClient.user) {
      //   await chatClient.disconnectUser();
      // }
      const currentUser = role === UserRole.Doctor ? doctor : patient;
      if (currentUser) {
        await chatClient.connectUser({ id: currentUser.id }, currentUser.stream_chat_token);
        await registerPushToken(currentUser.id);
        setClientIsReady(true);
      }

      // return async () => {
      //   await chatClient?.disconnectUser();
      //   unsubscribeTokenRefreshListenerRef.current?.();
      // };
    } catch (error) {
      logError(error);
      toast.error('Unable to connect with Chat server, please try again later.');
    }
  };

  useEffect(() => {
    if (loggedIn && (patient || doctor)) setupClient();
  }, [loggedIn, patient, doctor]);

  return {
    clientIsReady,
  };
};
