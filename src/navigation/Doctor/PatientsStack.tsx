import { Screens } from '@core/config/screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddGeneralNoteScreen from '@screens/Doctor/AddGeneralNoteScreen/AddGeneralNoteScreen';
import AddHealthIssueScreen, {
  AddHealthIssueScreenParams,
} from '@screens/Doctor/AddHealthIssueScreen/AddHealthIssueScreen';
import AddMedicationScreen, {
  AddMedicationScreenParams,
} from '@screens/Doctor/AddMedicationScreen/AddMedicationScreen';
import AddNoteScreen, { AddNoteScreenParams } from '@screens/Doctor/AddNoteScreen/AddNoteScreen';
import AddReferNoteScreen, {
  AddReferNoteScreenParams,
} from '@screens/Doctor/AddReferNoteScreen/AddReferNoteScreen';
import GeneralNotesScreen, {
  GeneralNotesScreenParams,
} from '@screens/Doctor/GeneralNotesScreen/GeneralNotesScreen';
import MedicationHistoryScreen, {
  MedicationHistoryScreenParams,
} from '@screens/Doctor/MedicationHistoryScreen/MedicationHistoryScreen';
import NotesScreen, { NotesScreenParams } from '@screens/Doctor/NotesScreen/NotesScreen';
import PatientDetailScreen, {
  PatientDetailScreenParams,
} from '@screens/Doctor/PatientDetailScreen/PatientDetailScreen';
import PatientsScreen, {
  PatientsScreenParams,
} from '@screens/Doctor/PatientsScreen/PatientsScreen';
import ReferDoctorScreen, {
  ReferDoctorScreenParams,
} from '@screens/Doctor/ReferDoctorScreen/ReferDoctorScreen';
import ReferPatientScreen, {
  ReferPatientScreenParams,
} from '@screens/Doctor/ReferPatientScreen/ReferPatientScreen';
import RequestsScreen, {
  RequestsScreenParams,
} from '@screens/Doctor/RequestsScreen/RequestsScreen';
import SearchDoctorScreen, {
  SearchDoctorScreenParams,
} from '@screens/Patient/SearchDoctorScreen/SearchDoctorScreen';
import SearchHealthIssueScreen, {
  SearchHealthIssuesScreenParams,
} from '@screens/Patient/SearchHealthIssueScreen/SearchHealthIssueScreen';
import SearchMedicationScreen, {
  SearchMedicationScreenParams,
} from '@screens/Patient/SearchMedicationScreen/SearchMedicationScreen';
import ChatDetailScreen, {
  ChatDetailScreenParams,
} from '@screens/Shared/ChatDetailScreen/ChatDetailScreen';
import ChatScreen, { ChatScreenParams } from '@screens/Shared/ChatScreen/ChatScreen';
import WebViewScreen, { WebViewScreenParams } from '@screens/Shared/WebViewScreen/WebViewScreen';
import React from 'react';

export type PatientsStackScreens = {
  [Screens.PatientsScreen]: PatientsScreenParams;
  [Screens.RequestsScreen]: RequestsScreenParams;
  [Screens.PatientDetailScreen]: PatientDetailScreenParams;
  [Screens.SearchHealthIssuesScreen]: SearchHealthIssuesScreenParams;
  [Screens.SearchMedicationScreen]: SearchMedicationScreenParams;
  [Screens.SearchDoctorScreen]: SearchDoctorScreenParams;
  [Screens.AddNoteScreen]: AddNoteScreenParams;
  [Screens.ChatScreen]: ChatScreenParams;
  [Screens.ChatDetailScreen]: ChatDetailScreenParams;
  [Screens.ReferPatientScreen]: ReferPatientScreenParams;
  [Screens.MedicationHistoryScreen]: MedicationHistoryScreenParams;
  [Screens.NotesScreen]: NotesScreenParams;
  [Screens.GeneralNotesScreen]: GeneralNotesScreenParams;
  [Screens.AddGeneralNoteScreen]: GeneralNotesScreenParams;
  [Screens.AddMedicationScreen]: AddMedicationScreenParams;
  [Screens.AddHealthIssueScreen]: AddHealthIssueScreenParams;
  [Screens.ReferDoctorScreen]: ReferDoctorScreenParams;
  [Screens.AddReferNoteScreen]: AddReferNoteScreenParams;
  [Screens.WebViewScreen]: WebViewScreenParams;
};

const Stack = createNativeStackNavigator<PatientsStackScreens>();

const PatientsStack = () => {
  const initialScreen = Screens.PatientsScreen;

  return (
    <Stack.Navigator initialRouteName={initialScreen} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Screens.PatientsScreen} component={PatientsScreen} />
      <Stack.Screen name={Screens.RequestsScreen} component={RequestsScreen} />
      <Stack.Screen name={Screens.PatientDetailScreen} component={PatientDetailScreen} />
      <Stack.Screen name={Screens.SearchHealthIssuesScreen} component={SearchHealthIssueScreen} />
      <Stack.Screen name={Screens.MedicationHistoryScreen} component={MedicationHistoryScreen} />
      <Stack.Screen name={Screens.SearchDoctorScreen} component={SearchDoctorScreen} />
      <Stack.Screen
        name={Screens.AddNoteScreen}
        component={AddNoteScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name={Screens.ChatScreen} component={ChatScreen} />
      <Stack.Screen name={Screens.ChatDetailScreen} component={ChatDetailScreen} />
      <Stack.Screen name={Screens.SearchMedicationScreen} component={SearchMedicationScreen} />
      <Stack.Screen name={Screens.ReferPatientScreen} component={ReferPatientScreen} />
      <Stack.Screen name={Screens.WebViewScreen} component={WebViewScreen} />
      <Stack.Screen
        name={Screens.NotesScreen}
        component={NotesScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name={Screens.GeneralNotesScreen} component={GeneralNotesScreen} />
      <Stack.Screen name={Screens.AddGeneralNoteScreen} component={AddGeneralNoteScreen} />
      <Stack.Screen
        name={Screens.AddMedicationScreen}
        component={AddMedicationScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name={Screens.AddHealthIssueScreen}
        component={AddHealthIssueScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name={Screens.ReferDoctorScreen}
        component={ReferDoctorScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name={Screens.AddReferNoteScreen}
        component={AddReferNoteScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
};

export default PatientsStack;
