import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Block from '@components/Block/Block';
import ScrollView from '@components/ScrollView/ScrollView';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import HealthIssues from '@modules/Patient/MyHealth/HealthIssues/HealthIssues';
import Medications from '@modules/Patient/MyHealth/Medications/Medications';
import { MyHealthStackScreens } from '@navigation/Patient/MyHealthStack';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { refetchPatient } from '@store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@store/store';

type MyHealthScreenProps = NativeStackScreenProps<MyHealthStackScreens, Screens.MyHealthScreen>;

export type MyHealthScreenParams = object;

const MyHealthScreen: React.FC<MyHealthScreenProps> = (props) => {
  const height = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const fetchingProfile = useAppSelector((state) => state.auth.fetchingProfile);

  const handleRefresh = () => {
    dispatch(refetchPatient());
  };

  return (
    <Block flex1 pH="xxxl" pT={insets.top} pB={height}>
      <Typography variation="title2Bolder">My Health</Typography>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={fetchingProfile} onRefresh={handleRefresh} />}>
        <Medications />
        <HealthIssues />
      </ScrollView>
    </Block>
  );
};

export default MyHealthScreen;
