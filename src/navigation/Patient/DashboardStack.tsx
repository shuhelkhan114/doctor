import { Screens } from '@core/config/screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PatientDetailScreenParams } from '@screens/Doctor/PatientDetailScreen/PatientDetailScreen';
import AddDoctorScreen, {
  AddDoctorScreenParams,
} from '@screens/Patient/AddDoctorScreen/AddDoctorScreen';
import CareTeamScreen, {
  CareTeamScreenParams,
} from '@screens/Patient/CareTeamScreen/CareTeamScreen';
import PatientDashboardScreen, {
  PatientDashboardScreenParams,
} from '@screens/Patient/Dashboard/DashboardScreen';
import NewsFeedScreen, {
  NewsfeedScreenParams,
} from '@screens/Patient/NewsFeedScreen/NewsFeedScreen';
import NotificationsScreen, {
  NotificationsScreenParams,
} from '@screens/Patient/NotificationsScreen/NotificationsScreen';
import SearchDoctorScreen, {
  SearchDoctorScreenParams,
} from '@screens/Patient/SearchDoctorScreen/SearchDoctorScreen';
import SearchHealthIssueScreen, {
  SearchHealthIssuesScreenParams,
} from '@screens/Patient/SearchHealthIssueScreen/SearchHealthIssueScreen';
import SearchMedicationScreen, {
  SearchMedicationScreenParams,
} from '@screens/Patient/SearchMedicationScreen/SearchMedicationScreen';
import SubscriptionScreen, {
  SubscriptionScreenParams,
} from '@screens/Patient/SubscriptionScreen/SubscriptionScreen';
import UpdateAddressScreen, {
  UpdateAddressScreenParams,
} from '@screens/Patient/UpdateAddressScreen/UpdateAddressScreen';
import UpdateContactScreen, {
  UpdateContactScreenParams,
} from '@screens/Patient/UpdateContactScreen/UpdateContactScreen';
import ChatDetailScreen, {
  ChatDetailScreenParams,
} from '@screens/Shared/ChatDetailScreen/ChatDetailScreen';
import ChatScreen, { ChatScreenParams } from '@screens/Shared/ChatScreen/ChatScreen';
import WebViewScreen, { WebViewScreenParams } from '@screens/Shared/WebViewScreen/WebViewScreen';

export type DashboardStackScreens = {
  [Screens.DashboardScreen]: PatientDashboardScreenParams;
  [Screens.SearchDoctorScreen]: SearchDoctorScreenParams;
  [Screens.ChatScreen]: ChatScreenParams;
  [Screens.ChatDetailScreen]: ChatDetailScreenParams;
  [Screens.UpdateAddressScreen]: UpdateAddressScreenParams;
  [Screens.UpdateContactScreen]: UpdateContactScreenParams;
  [Screens.SearchMedicationScreen]: SearchMedicationScreenParams;
  [Screens.SearchHealthIssuesScreen]: SearchHealthIssuesScreenParams;
  [Screens.CareTeamScreen]: CareTeamScreenParams;
  [Screens.NewsFeedScreen]: NewsfeedScreenParams;
  [Screens.SubscriptionScreen]: SubscriptionScreenParams;
  [Screens.WebViewScreen]: WebViewScreenParams;
  [Screens.AddDoctorScreen]: AddDoctorScreenParams;
  [Screens.NotificationsScreen]: NotificationsScreenParams;
  // INFO: We don't need this here but still adding it to fix ts issue in useNotification.ts fil for userNavigation hook
  [Screens.PatientDetailScreen]: PatientDetailScreenParams;
};

const Stack = createNativeStackNavigator<DashboardStackScreens>();

const DashboardStack = () => {
  const initialScreen = Screens.DashboardScreen;

  return (
    <Stack.Navigator initialRouteName={initialScreen} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Screens.DashboardScreen} component={PatientDashboardScreen} />
      <Stack.Screen name={Screens.SearchDoctorScreen} component={SearchDoctorScreen} />
      <Stack.Screen name={Screens.ChatScreen} component={ChatScreen} />
      <Stack.Screen name={Screens.UpdateAddressScreen} component={UpdateAddressScreen} />
      <Stack.Screen name={Screens.UpdateContactScreen} component={UpdateContactScreen} />
      <Stack.Screen name={Screens.SearchMedicationScreen} component={SearchMedicationScreen} />
      <Stack.Screen name={Screens.SearchHealthIssuesScreen} component={SearchHealthIssueScreen} />
      <Stack.Screen name={Screens.ChatDetailScreen} component={ChatDetailScreen} />
      <Stack.Screen name={Screens.CareTeamScreen} component={CareTeamScreen} />
      <Stack.Screen name={Screens.NewsFeedScreen} component={NewsFeedScreen} />
      <Stack.Screen name={Screens.SubscriptionScreen} component={SubscriptionScreen} />
      <Stack.Screen name={Screens.WebViewScreen} component={WebViewScreen} />
      <Stack.Screen name={Screens.NotificationsScreen} component={NotificationsScreen} />
      <Stack.Screen
        name={Screens.AddDoctorScreen}
        component={AddDoctorScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
};

export default DashboardStack;
