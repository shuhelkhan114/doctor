import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { Screens } from '@core/config/screens';
import DoximityLoginErrorScreen, {
  DoximityLoginErrorScreenParams,
} from '@screens/Doctor/DoximityLoginErrorScreen/DoximityLoginErrorScreen';
import DoximityLoginScreen from '@screens/Doctor/DoximityLoginScreen/DoximityLoginScreen';
import PatientDashboardScreen from '@screens/Patient/Dashboard/DashboardScreen';
import DoctorSelectionScreen, {
  DoctorSelectionParams,
} from '@screens/Patient/DoctorSelectionScreen/DoctorSelectionScreen';
import FHIRLoginErrorScreen, {
  FHIRLoginErrorScreenParams,
} from '@screens/Patient/FHIRLoginErrorScreen/FHIRLoginErrorScreen';
import FHIRLoginScreen, {
  FHIRLoginScreenParams,
} from '@screens/Patient/FHIRLoginScreen/FHIRLoginScreen';
import FHIRProviderSelectionScreen, {
  FHIRProviderSelectionScreenParams,
} from '@screens/Patient/FHIRProviderSelectionScreen/FHIRProviderSelectionScreen';
import ForgotPasswordScreen, {
  ForgotPasswordScreenParams,
} from '@screens/Patient/ForgotPasswordScreen/ForgotPasswordScreen';
import ForgotPasswordVerificationScreen, {
  ForgotPasswordVerificationScreenParams,
} from '@screens/Patient/ForgotPasswordVerificationScreen/ForgotPasswordVerificationScreen';
import GaeaSearchingScreen, {
  GaeaSearchingScreenParams,
} from '@screens/Patient/GaeaSearchingScreen/GaeaSearchingScreen';
import GaeaWelcomeScreen, {
  GaeaWelcomeScreenParams,
} from '@screens/Patient/GaeaWelcomeScreen/GaeaWelcomeScreen';
import HealthIssuesSelectionScreen, {
  HealthIssuesSelectionScreenParams,
} from '@screens/Patient/HealthIssuesSelectionScreen/HealthIssuesSelectionScreen';
import LoginScreen from '@screens/Patient/LoginScreen/LoginScreen';
import MedicationSelectionScreen, {
  MedicationSelectionScreenParams,
} from '@screens/Patient/MedicationSelectionScreen/MedicationSelectionScreen';
import ResetPasswordScreen, {
  ResetPasswordScreenParams,
} from '@screens/Patient/ResetPasswordScreen/ResetPasswordScreen';
import SearchDoctorScreen, {
  SearchDoctorScreenParams,
} from '@screens/Patient/SearchDoctorScreen/SearchDoctorScreen';
import SearchHealthIssueScreen, {
  SearchHealthIssuesScreenParams,
} from '@screens/Patient/SearchHealthIssueScreen/SearchHealthIssueScreen';
import SearchMedicationScreen, {
  SearchMedicationScreenParams,
} from '@screens/Patient/SearchMedicationScreen/SearchMedicationScreen';
import SignupScreen, { SignupScreenParams } from '@screens/Patient/SignUpScreen/SignupScreen';
import LandingScreen from '@screens/Shared/LandingScreen/LandingScreen';
import WebViewScreen, { WebViewScreenParams } from '@screens/Shared/WebViewScreen/WebViewScreen';

export type AuthStackScreens = {
  [Screens.LandingScreen]: undefined;
  [Screens.LoginScreen]: undefined;
  [Screens.SignupScreen]: SignupScreenParams;
  [Screens.DoximityLoginScreen]: undefined;
  [Screens.GaeaWelcomeScreen]: GaeaWelcomeScreenParams;
  [Screens.MedicationSelectionScreen]: MedicationSelectionScreenParams;
  [Screens.DoctorSelectionScreen]: DoctorSelectionParams;
  [Screens.SearchMedicationScreen]: SearchMedicationScreenParams;
  [Screens.SearchHealthIssuesScreen]: SearchHealthIssuesScreenParams;
  [Screens.GaeaSearchingScreen]: GaeaSearchingScreenParams;
  [Screens.SearchDoctorScreen]: SearchDoctorScreenParams;
  [Screens.HealthIssuesSelectionScreen]: HealthIssuesSelectionScreenParams;
  [Screens.DashboardScreen]: undefined;
  [Screens.FHIRLoginScreen]: FHIRLoginScreenParams;
  [Screens.DoximityLoginErrorScreen]: DoximityLoginErrorScreenParams;
  [Screens.FHIRLoginErrorScreen]: FHIRLoginErrorScreenParams;
  [Screens.ForgotPasswordScreen]: ForgotPasswordScreenParams;
  [Screens.ForgotPasswordVerificationScreen]: ForgotPasswordVerificationScreenParams;
  [Screens.ResetPasswordScreen]: ResetPasswordScreenParams;
  [Screens.FHIRProviderSelectionScreen]: FHIRProviderSelectionScreenParams;
  [Screens.WebViewScreen]: WebViewScreenParams;
};

const Stack = createNativeStackNavigator<AuthStackScreens>();

const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={Screens.LandingScreen}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Screens.LandingScreen} component={LandingScreen} />
      <Stack.Screen name={Screens.LoginScreen} component={LoginScreen} />
      <Stack.Screen name={Screens.SignupScreen} component={SignupScreen} />
      <Stack.Screen name={Screens.DoximityLoginScreen} component={DoximityLoginScreen} />
      <Stack.Screen name={Screens.GaeaWelcomeScreen} component={GaeaWelcomeScreen} />
      <Stack.Screen
        name={Screens.MedicationSelectionScreen}
        component={MedicationSelectionScreen}
      />
      <Stack.Screen name={Screens.SearchMedicationScreen} component={SearchMedicationScreen} />
      <Stack.Screen name={Screens.GaeaSearchingScreen} component={GaeaSearchingScreen} />
      <Stack.Screen name={Screens.DoctorSelectionScreen} component={DoctorSelectionScreen} />
      <Stack.Screen name={Screens.SearchDoctorScreen} component={SearchDoctorScreen} />
      <Stack.Screen
        name={Screens.HealthIssuesSelectionScreen}
        component={HealthIssuesSelectionScreen}
      />
      <Stack.Screen name={Screens.DashboardScreen} component={PatientDashboardScreen} />
      <Stack.Screen name={Screens.FHIRLoginScreen} component={FHIRLoginScreen} />
      <Stack.Screen name={Screens.DoximityLoginErrorScreen} component={DoximityLoginErrorScreen} />
      <Stack.Screen name={Screens.SearchHealthIssuesScreen} component={SearchHealthIssueScreen} />
      <Stack.Screen name={Screens.FHIRLoginErrorScreen} component={FHIRLoginErrorScreen} />
      <Stack.Screen name={Screens.ForgotPasswordScreen} component={ForgotPasswordScreen} />
      <Stack.Screen
        name={Screens.ForgotPasswordVerificationScreen}
        component={ForgotPasswordVerificationScreen}
      />
      <Stack.Screen name={Screens.ResetPasswordScreen} component={ResetPasswordScreen} />
      <Stack.Screen
        name={Screens.FHIRProviderSelectionScreen}
        component={FHIRProviderSelectionScreen}
      />
      <Stack.Screen name={Screens.WebViewScreen} component={WebViewScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
