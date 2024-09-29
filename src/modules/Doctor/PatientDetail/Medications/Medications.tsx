import Block, { BlockProps } from '@components/Block/Block';
import Button from '@components/Button/Button';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import MedicationRow from '@modules/Doctor/Patients/MedicationRow';
import { PatientsStackScreens } from '@navigation/Doctor/PatientsStack';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Medication } from '@typings/model/medication';
import React from 'react';

interface MedicationsProps extends BlockProps {
  patient: {
    id: string;
    name: string;
    imageUrl: string;
  };
  hasSentRequest: boolean;
  medications: Medication[];
  onMedicationPress?: (medication: Medication) => void;
}

const Medications: React.FC<MedicationsProps> = (props) => {
  const { patient, medications = [], hasSentRequest, onMedicationPress, ...restProps } = props;

  const navigation =
    useNavigation<StackNavigationProp<PatientsStackScreens, Screens.PatientDetailScreen>>();

  const handleAddMedication = () => {
    // navigation.navigate(Screens.SearchMedicationScreen, {
    //   from: 'DOCTOR',
    //   patient: {
    //     id: patient.id,
    //     name: patient.name,
    //     imageUrl: patient.imageUrl,
    //   },
    // });
    navigation.navigate(Screens.AddMedicationScreen, {
      patient: {
        id: patient.id,
        name: patient.name,
        imageUrl: patient.imageUrl,
        doctorsCount: 0,
        healthIssuesCount: 0,
      },
    });
  };

  let content: React.ReactNode = null;

  if (medications.length < 1) {
    content = (
      <Typography color="dark" variation="description1">
        Medications that you and other doctors inform that this patient is taking will show here.
        This is not a prescription mechanism.
      </Typography>
    );
  } else {
    content = medications.map((medication, index) => {
      const handleMedicationPress = () => {
        onMedicationPress?.(medication);
      };

      return (
        <MedicationRow
          bC="lightest"
          key={medication.id}
          medication={medication}
          onPress={handleMedicationPress}
          bBW={index === medications.length - 1 ? 0 : 1}
        />
      );
    });
  }

  return (
    <Block {...restProps}>
      <Typography color="black" mB="md" variation="title2">
        Medications
      </Typography>
      {content}
      {!hasSentRequest && (
        <Button
          mT="xl"
          title="Add medication"
          variation="secondary"
          onPress={handleAddMedication}
        />
      )}
    </Block>
  );
};

export default Medications;
