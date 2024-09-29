import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { Screens } from '@core/config/screens';
import AddDoctorScreen, {
  AddDoctorScreenParams,
} from '@screens/Patient/AddDoctorScreen/AddDoctorScreen';
import CareTeamScreen from '@screens/Patient/CareTeamScreen/CareTeamScreen';
import SearchDoctorScreen, {
  SearchDoctorScreenParams,
} from '@screens/Patient/SearchDoctorScreen/SearchDoctorScreen';
import ChatDetailScreen, {
  ChatDetailScreenParams,
} from '@screens/Shared/ChatDetailScreen/ChatDetailScreen';
import ChatScreen, { ChatScreenParams } from '@screens/Shared/ChatScreen/ChatScreen';
import WebViewScreen, { WebViewScreenParams } from '@screens/Shared/WebViewScreen/WebViewScreen';

export type CareTeamStackScreens = {
  [Screens.CareTeamScreen]: undefined;
  [Screens.SearchDoctorScreen]: SearchDoctorScreenParams;
  [Screens.ChatScreen]: ChatScreenParams;
  [Screens.ChatDetailScreen]: ChatDetailScreenParams;
  [Screens.AddDoctorScreen]: AddDoctorScreenParams;
  [Screens.WebViewScreen]: WebViewScreenParams;
};

const Stack = createNativeStackNavigator<CareTeamStackScreens>();

const CareTeamStack = () => {
  const initialScreen = Screens.CareTeamScreen;

  return (
    <Stack.Navigator initialRouteName={initialScreen} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Screens.CareTeamScreen} component={CareTeamScreen} />
      <Stack.Screen name={Screens.SearchDoctorScreen} component={SearchDoctorScreen} />
      <Stack.Screen name={Screens.ChatScreen} component={ChatScreen} />
      <Stack.Screen name={Screens.ChatDetailScreen} component={ChatDetailScreen} />
      <Stack.Screen name={Screens.WebViewScreen} component={WebViewScreen} />
      <Stack.Screen
        name={Screens.AddDoctorScreen}
        component={AddDoctorScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
};

export default CareTeamStack;
