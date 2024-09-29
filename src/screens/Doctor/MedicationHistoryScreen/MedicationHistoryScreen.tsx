import { NativeStackScreenProps } from '@react-navigation/native-stack';

import Block from '@components/Block/Block';
import ArrowLeftIcon from '@components/Icons/ArrowLeftIcon';
import Image from '@components/Image/Image';
import KeyboardView from '@components/KeyboardView/KeyboardView';
import PrimaryNavigationBar from '@components/NavigationBar/PrimaryNavigationBar/PrimaryNavigationBar';
import ScrollView from '@components/ScrollView/ScrollView';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import { getSize } from '@core/utils/responsive';
import MedicationHistoryRow from '@modules/Doctor/MedicationHistory/HistoryRow/HistoryRow';
import { PatientsStackScreens } from '@navigation/Doctor/PatientsStack';
import { Medication } from '@typings/model/medication';

type MedicationHistoryScreenProps = NativeStackScreenProps<
  PatientsStackScreens,
  Screens.MedicationHistoryScreen
>;

export type MedicationHistoryScreenParams = {
  medication: Medication;
  patient: {
    name: string;
    imageUrl: string;
  };
};

const MedicationHistoryScreen: React.FC<MedicationHistoryScreenProps> = (props) => {
  const { navigation, route } = props;
  const { medication, patient } = route.params || {};

  return (
    <KeyboardView>
      <PrimaryNavigationBar>
        <Block pH="xxxl" pB="xl" flexDirection="row" align="center">
          <Block pR="md" onPress={navigation.goBack}>
            <ArrowLeftIcon fill="white" />
          </Block>
          <Image mR="md" uri={patient.imageUrl} size={48} circular />
          <Block mR="auto">
            <Typography variation="title3Bolder" color="white">
              Medication history
            </Typography>
            <Typography color="white" variation="description1" style={{ marginTop: getSize(-4) }}>
              {patient.name}
            </Typography>
          </Block>
        </Block>
      </PrimaryNavigationBar>

      <ScrollView>
        <Block>
          <Block pV="xxxl" pH="xxxl">
            <Typography variation="title2">{medication.name}</Typography>
            <Typography variation="description1" color="dark">
              {medication.dosage}
            </Typography>
            {medication.history.length < 1 ? (
              <Typography mT="xxxl">No medication history found!</Typography>
            ) : (
              medication.history.map((history, index) => {
                return (
                  <MedicationHistoryRow
                    bC="lightest"
                    history={history}
                    key={history.status}
                    bBW={index === medication.history.length - 1 ? 0 : 1}
                  />
                );
              })
            )}
          </Block>
        </Block>
      </ScrollView>
    </KeyboardView>
  );
};

export default MedicationHistoryScreen;
