import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { Screens } from '@core/config/screens';
import MedicationHistoryScreen, {
  MedicationHistoryScreenParams,
} from '@screens/Doctor/MedicationHistoryScreen/MedicationHistoryScreen';
import MyHealthScreen from '@screens/Patient/MyHealthScreen/MyHealthScreen';
import SearchHealthIssueScreen, {
  SearchHealthIssuesScreenParams,
} from '@screens/Patient/SearchHealthIssueScreen/SearchHealthIssueScreen';
import SearchMedicationScreen, {
  SearchMedicationScreenParams,
} from '@screens/Patient/SearchMedicationScreen/SearchMedicationScreen';
import WebViewScreen, { WebViewScreenParams } from '@screens/Shared/WebViewScreen/WebViewScreen';

export type MyHealthStackScreens = {
  [Screens.MyHealthScreen]: undefined;
  [Screens.SearchMedicationScreen]: SearchMedicationScreenParams;
  [Screens.SearchHealthIssuesScreen]: SearchHealthIssuesScreenParams;
  [Screens.MedicationHistoryScreen]: MedicationHistoryScreenParams;
  [Screens.WebViewScreen]: WebViewScreenParams;
};

const Stack = createNativeStackNavigator<MyHealthStackScreens>();

const MyHealthStack = () => {
  const initialScreen = Screens.MyHealthScreen;

  return (
    <Stack.Navigator initialRouteName={initialScreen} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Screens.MyHealthScreen} component={MyHealthScreen} />
      <Stack.Screen name={Screens.SearchMedicationScreen} component={SearchMedicationScreen} />
      <Stack.Screen name={Screens.SearchHealthIssuesScreen} component={SearchHealthIssueScreen} />
      <Stack.Screen name={Screens.MedicationHistoryScreen} component={MedicationHistoryScreen} />
      <Stack.Screen name={Screens.WebViewScreen} component={WebViewScreen} />
    </Stack.Navigator>
  );
};

export default MyHealthStack;
