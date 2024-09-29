import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { Screens } from '@core/config/screens';
import MessagesScreen, {
  MessagesScreenParams,
} from '@screens/Patient/MessagesScreen/MessagesScreen';
import ChatDetailScreen, {
  ChatDetailScreenParams,
} from '@screens/Shared/ChatDetailScreen/ChatDetailScreen';
import ChatScreen, { ChatScreenParams } from '@screens/Shared/ChatScreen/ChatScreen';
import WebViewScreen, { WebViewScreenParams } from '@screens/Shared/WebViewScreen/WebViewScreen';

export type MessagesStackScreens = {
  [Screens.MessagesScreen]: MessagesScreenParams;
  [Screens.ChatScreen]: ChatScreenParams;
  [Screens.ChatDetailScreen]: ChatDetailScreenParams;
  [Screens.WebViewScreen]: WebViewScreenParams;
};

const Stack = createNativeStackNavigator<MessagesStackScreens>();

const MessagesStack = () => {
  const initialScreen = Screens.MessagesScreen;

  return (
    <Stack.Navigator initialRouteName={initialScreen} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Screens.MessagesScreen} component={MessagesScreen} />
      <Stack.Screen name={Screens.ChatScreen} component={ChatScreen} />
      <Stack.Screen name={Screens.ChatDetailScreen} component={ChatDetailScreen} />
      <Stack.Screen name={Screens.WebViewScreen} component={WebViewScreen} />
    </Stack.Navigator>
  );
};

export default MessagesStack;
