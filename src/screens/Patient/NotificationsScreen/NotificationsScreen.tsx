import Block from '@components/Block/Block';
import DefaultNavigationBar from '@components/NavigationBar/DefaultNavigationBar';
import { Screens } from '@core/config/screens';
import API from '@core/services';
import { DashboardStackScreens } from '@navigation/Patient/DashboardStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from 'react-query';

type NotificationsScreenProps = NativeStackScreenProps<
  DashboardStackScreens,
  Screens.NotificationsScreen
>;

export type NotificationsScreenParams = undefined;

const NotificationsScreen: React.FC<NotificationsScreenProps> = (props) => {
  const { navigation } = props;

  const {
    isLoading,
    error,
    data: notifications,
  } = useQuery('patient/notifications', API.patient.notification.fetchNotifications);

  return (
    <Block>
      <DefaultNavigationBar title="Notifications" />
    </Block>
  );
};

export default NotificationsScreen;
