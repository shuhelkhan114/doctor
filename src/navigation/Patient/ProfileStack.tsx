import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { Screens } from '@core/config/screens';
import EditAccessScreen, {
  EditAccessScreenParams,
} from '@screens/Patient/ProfileScreen/EditAccessScreen';
import ProfileScreen from '@screens/Patient/ProfileScreen/ProfileScreen';
import SubscriptionScreen, {
  SubscriptionScreenParams,
} from '@screens/Patient/SubscriptionScreen/SubscriptionScreen';
import UpdateAddressScreen from '@screens/Patient/UpdateAddressScreen/UpdateAddressScreen';
import UpdateContactScreen, {
  UpdateContactScreenParams,
} from '@screens/Patient/UpdateContactScreen/UpdateContactScreen';
import UpdateDOBScreen, {
  UpdateDOBScreenParams,
} from '@screens/Patient/UpdateDOBScreen/UpdateDOBScreen';
import UpgradePlanScreen, {
  UpgradePlanScreenParams,
} from '@screens/Patient/UpgradePlanScreen/UpgradePlanScreen';
import WebViewScreen, { WebViewScreenParams } from '@screens/Shared/WebViewScreen/WebViewScreen';

export type ProfileStackScreens = {
  [Screens.ProfileScreen]: undefined;
  [Screens.UpdateAddressScreen]: undefined;
  [Screens.UpdateContactScreen]: UpdateContactScreenParams;
  [Screens.UpdateDOBScreen]: UpdateDOBScreenParams;
  [Screens.EditAccessScreen]: EditAccessScreenParams;
  [Screens.WebViewScreen]: WebViewScreenParams;
  [Screens.SubscriptionScreen]: SubscriptionScreenParams;
  [Screens.UpgradePlanScreen]: UpgradePlanScreenParams;
};

const Stack = createNativeStackNavigator<ProfileStackScreens>();

const ProfileStack = () => {
  const initialScreen = Screens.ProfileScreen;

  return (
    <Stack.Navigator initialRouteName={initialScreen} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Screens.ProfileScreen} component={ProfileScreen} />
      <Stack.Screen name={Screens.UpdateAddressScreen} component={UpdateAddressScreen} />
      <Stack.Screen name={Screens.UpdateContactScreen} component={UpdateContactScreen} />
      <Stack.Screen name={Screens.UpdateDOBScreen} component={UpdateDOBScreen} />
      <Stack.Screen name={Screens.EditAccessScreen} component={EditAccessScreen} />
      <Stack.Screen name={Screens.WebViewScreen} component={WebViewScreen} />
      <Stack.Screen name={Screens.SubscriptionScreen} component={SubscriptionScreen} />
      <Stack.Screen name={Screens.UpgradePlanScreen} component={UpgradePlanScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
