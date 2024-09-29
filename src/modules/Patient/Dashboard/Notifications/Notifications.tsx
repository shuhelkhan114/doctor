import Block, { BlockProps } from '@components/Block/Block';
import CampaignIcon from '@components/Icons/CampaignIcon';
import ChevronRightIcon from '@components/Icons/ChevronRightIcon';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import { DashboardStackScreens } from '@navigation/Patient/DashboardStack';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppSelector } from '@store/store';
import React from 'react';

interface NotificationsProps extends BlockProps {}

const Notifications: React.FC<NotificationsProps> = (props) => {
  const {} = props;

  const navigation =
    useNavigation<StackNavigationProp<DashboardStackScreens, Screens.DashboardScreen>>();
  const auth = useAppSelector((state) => state.auth);

  return (
    <Block>
      <Block
        pH="xxxl"
        pV="xl"
        mB="xl"
        shadow="sm"
        rounded="xxl"
        align="center"
        bgColor="white"
        flexDirection="row"
        onPress={() => navigation.navigate(Screens.NotificationsScreen)}>
        <CampaignIcon />
        <Block mL="xl" flex1>
          <Typography variation="title3" color="darkest">
            Missed notifications
          </Typography>
          <Typography variation="description1" numberOfLines={1} color="dark">
            {auth.doctor?.inapp_notifications_count} notifications not seen
          </Typography>
        </Block>
        <ChevronRightIcon />
      </Block>
    </Block>
  );
};

export default Notifications;
