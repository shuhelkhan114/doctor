import { Screens } from '@core/config/screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DoximityScreen, {
  DoximityScreenParams,
} from '@screens/Doctor/DoximityScreen/DoximityScreen';
import WebViewScreen, { WebViewScreenParams } from '@screens/Shared/WebViewScreen/WebViewScreen';
import React from 'react';

export type DoximityStackScreens = {
  [Screens.DoximityScreen]: DoximityScreenParams;
  [Screens.WebViewScreen]: WebViewScreenParams;
};

const Stack = createNativeStackNavigator<DoximityStackScreens>();

const DoximityStack = () => {
  const initialScreen = Screens.DoximityScreen;

  return (
    <Stack.Navigator initialRouteName={initialScreen} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Screens.DoximityScreen} component={DoximityScreen} />
      <Stack.Screen name={Screens.WebViewScreen} component={WebViewScreen} />
    </Stack.Navigator>
  );
};

export default DoximityStack;
