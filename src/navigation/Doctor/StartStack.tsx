import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Screens } from '@core/config/screens';
import ChatAvailabilityScreen, {
  ChatAvailabilityScreenParams,
} from '@screens/Doctor/ChatAvailabilityScreen/ChatAvailabilityScreen';
import InvitePatientsScreen, {
  InvitePatientsScreenParams,
} from '@screens/Doctor/InvitePatientsScreen/InvitePatientsScreen';
import MedicationChangesScreen, {
  MedicationChangesScreenParams,
} from '@screens/Doctor/MedicationChangesScreen/MedicationChangesScreen';
import MonetizationScreen, {
  MonetizationScreenParams,
} from '@screens/Doctor/MonetizationScreen/MonetizationScreen';
import NotificationsScreen, {
  NotificationsScreenParams,
} from '@screens/Doctor/NotificationsScreen/NotificationsScreen';
import PatientDetailScreen, {
  PatientDetailScreenParams,
} from '@screens/Doctor/PatientDetailScreen/PatientDetailScreen';
import ProfileScreen, { ProfileScreenParams } from '@screens/Doctor/ProfileScreen/ProfileScreen';
import RequestsScreen, {
  RequestsScreenParams,
} from '@screens/Doctor/RequestsScreen/RequestsScreen';
import StartScreen, { StartScreenParams } from '@screens/Doctor/StartScreen/StartScreen';
import UpdateAddressScreen, {
  UpdateAddressScreenParams,
} from '@screens/Doctor/UpdateAddressScreen/UpdateAddressScreen';
import UpdateContactScreen, {
  UpdateContactScreenParams,
} from '@screens/Doctor/UpdateContactScreen/UpdateContactScreen';
import { NewsfeedScreenParams } from '@screens/Patient/NewsFeedScreen/NewsFeedScreen';
import ChatDetailScreen, {
  ChatDetailScreenParams,
} from '@screens/Shared/ChatDetailScreen/ChatDetailScreen';
import ChatScreen, { ChatScreenParams } from '@screens/Shared/ChatScreen/ChatScreen';
import WebViewScreen, { WebViewScreenParams } from '@screens/Shared/WebViewScreen/WebViewScreen';

export type StartStackScreens = {
  [Screens.StartScreen]: StartScreenParams;
  [Screens.DoctorProfileScreen]: ProfileScreenParams;
  [Screens.ChatAvailabilityScreen]: ChatAvailabilityScreenParams;
  [Screens.RequestsScreen]: RequestsScreenParams;
  [Screens.NotificationsScreen]: NotificationsScreenParams;
  [Screens.UpdateContactScreen]: UpdateContactScreenParams;
  [Screens.UpdateAddressScreen]: UpdateAddressScreenParams;
  [Screens.PatientDetailScreen]: PatientDetailScreenParams;
  [Screens.ChatScreen]: ChatScreenParams;
  [Screens.ChatDetailScreen]: ChatDetailScreenParams;
  [Screens.InvitePatientsScreen]: InvitePatientsScreenParams;
  [Screens.MonetizationScreen]: MonetizationScreenParams;
  [Screens.WebViewScreen]: WebViewScreenParams;
  [Screens.MedicationChangesScreen]: MedicationChangesScreenParams;
  // INFO: We don't need this here but still adding it to fix ts issue in useNotification.ts fil for userNavigation hook
  [Screens.NewsFeedScreen]: NewsfeedScreenParams;
};

const Stack = createNativeStackNavigator<StartStackScreens>();

const StartStack = () => {
  const initialScreen = Screens.StartScreen;

  return (
    <Stack.Navigator initialRouteName={initialScreen} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Screens.StartScreen} component={StartScreen} />
      <Stack.Screen name={Screens.DoctorProfileScreen} component={ProfileScreen} />
      <Stack.Screen name={Screens.ChatAvailabilityScreen} component={ChatAvailabilityScreen} />
      <Stack.Screen name={Screens.RequestsScreen} component={RequestsScreen} />
      <Stack.Screen name={Screens.PatientDetailScreen} component={PatientDetailScreen} />
      <Stack.Screen name={Screens.NotificationsScreen} component={NotificationsScreen} />
      <Stack.Screen name={Screens.UpdateContactScreen} component={UpdateContactScreen} />
      <Stack.Screen name={Screens.UpdateAddressScreen} component={UpdateAddressScreen} />
      <Stack.Screen name={Screens.ChatScreen} component={ChatScreen} />
      <Stack.Screen name={Screens.ChatDetailScreen} component={ChatDetailScreen} />
      <Stack.Screen name={Screens.InvitePatientsScreen} component={InvitePatientsScreen} />
      <Stack.Screen name={Screens.MonetizationScreen} component={MonetizationScreen} />
      <Stack.Screen name={Screens.WebViewScreen} component={WebViewScreen} />
      <Stack.Screen name={Screens.MedicationChangesScreen} component={MedicationChangesScreen} />
    </Stack.Navigator>
  );
};

export default StartStack;
