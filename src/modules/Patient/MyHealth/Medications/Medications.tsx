import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';

import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import Image from '@components/Image/Image';
import Modal from '@components/Modal/Modal';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import useAppTheme from '@hooks/useTheme';
import MedicationRow from '@modules/Doctor/Patients/MedicationRow';
import { useAppSelector } from '@store/store';
import { Medication } from '@typings/model/medication';
import { MyHealthStackScreens } from 'src/navigation/Patient/MyHealthStack';
import MedicationActions from '../MedicationActions/MedicationActions';

interface MedicationsProps {}

const Medications: React.FC<MedicationsProps> = (props) => {
  const theme = useAppTheme();
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const auth = useAppSelector((state) => state.auth);
  const navigation =
    useNavigation<StackNavigationProp<MyHealthStackScreens, Screens.MyHealthScreen>>();

  const medications = auth.patient?.medications || [];

  const handleClose = () => {
    setSelectedMedication(null);
  };

  let content: React.ReactNode = null;

  if (medications.length < 1) {
    content = (
      <Block align="center">
        <Image resizeMode="contain" size={200} source={require('@assets/no-medications.png')} />
        <Typography variation="title3" mT="xxl">
          No medications informed
        </Typography>
      </Block>
    );
  } else {
    content = medications.map((medication, index) => {
      const handleMedicationPress = () => {
        setSelectedMedication(medication);
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
    <Block>
      <Modal visible={!!selectedMedication} onClose={handleClose}>
        {selectedMedication && (
          <MedicationActions medication={selectedMedication} closeModal={handleClose} />
        )}
      </Modal>

      <Typography color="darkest" variation="title3Bolder" mT="4xl" mB="md">
        Medications
      </Typography>

      {content}

      <Button
        variation="secondary"
        title="Add Medication"
        onPress={() => navigation.navigate(Screens.SearchMedicationScreen)}
        style={{ marginTop: theme.spacing.xl }}
      />
    </Block>
  );
};

export default Medications;
