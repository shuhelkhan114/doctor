import Block from '@components/Block/Block';
import Image from '@components/Image/Image';
import DefaultNavigationBar from '@components/NavigationBar/DefaultNavigationBar';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import { StartStackScreens } from '@navigation/Doctor/StartStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type MedicationChangesScreenProps = NativeStackScreenProps<
  StartStackScreens,
  Screens.MedicationChangesScreen
>;

export type MedicationChangesScreenParams = {
  patient: {
    imageUrl: string;
    firstName: string;
    lastName: string;
  };
  medicationChangesCount: number;
};

const MedicationChangesScreen: React.FC<MedicationChangesScreenProps> = (props) => {
  const { navigation, route } = props;
  const { patient, medicationChangesCount } = route.params;
  const insets = useSafeAreaInsets();

  return (
    <Block>
      <DefaultNavigationBar title="Medications Changes" />
      <Block pH="xxxl">
        <Block flexDirection="row" align="center" pV="xl" bBW={1} bC="lightest">
          <Image mR="xl" uri={patient.imageUrl} size={56} circular />
          <Block>
            <Typography variation="title3Bolder">
              {patient.firstName} {patient.lastName}
            </Typography>
            <Typography>{medicationChangesCount} medication change</Typography>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default MedicationChangesScreen;
