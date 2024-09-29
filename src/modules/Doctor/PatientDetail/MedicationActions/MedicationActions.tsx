import React, { useMemo } from 'react';

import Block from '@components/Block/Block';
import ParagraphCheckIcon from '@components/Icons/ParagraphCheckIcon';
import PencilIcon from '@components/Icons/PencilIcon';
import StampIcon from '@components/Icons/StampIcon';
import TrashIcon from '@components/Icons/TrashIcon';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import toast from '@core/lib/toast';
import API from '@core/services';
import { PatientsStackScreens } from '@navigation/Doctor/PatientsStack';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Medication } from '@typings/model/medication';
import { ActivityIndicator } from 'react-native';
import { useMutation, useQueryClient } from 'react-query';

interface MedicationActionsProps {
  patient: {
    id: string;
    name: string;
    imageUrl: string;
  };
  medication: Medication;
  closeModal?: (visible: false) => void;
}

const MedicationActions: React.FC<MedicationActionsProps> = (props) => {
  const { patient, medication, closeModal } = props;

  const navigation =
    useNavigation<StackNavigationProp<PatientsStackScreens, Screens.PatientDetailScreen>>();
  const queryClient = useQueryClient();

  const { isLoading: confirmingMedication, mutate: confirmMedication } = useMutation(
    API.doctor.medication.confirmMedication,
    {
      onSuccess: () => {
        toast.success('Medication confirmed');
        queryClient.refetchQueries(['doctor/patient', patient.id]);
        closeModal?.(false);
      },
      onError: () => {
        toast.error('Error confirming medication, please try again!');
      },
    }
  );

  const { isLoading: removingMedication, mutate: removeMedication } = useMutation(
    API.doctor.medication.removeMedication,
    {
      onSuccess: () => {
        toast.success(`${medication?.name} removed`);
        queryClient.refetchQueries(['doctor/patient', patient.id]);
        closeModal?.(false);
      },
      onError: () => {
        toast.error(`Error removing ${medication?.name}, please try again!`);
      },
    }
  );

  const handleConfirmMedication = () => {
    confirmMedication({
      patientId: patient.id,
      medicationId: medication?.id,
    });
  };

  const handleRemoveMedication = () => {
    removeMedication({
      patientId: patient.id,
      medicationId: medication.id,
    });
  };

  const handleViewMedicationHistory = () => {
    navigation.navigate(Screens.MedicationHistoryScreen, {
      medication,
      patient: {
        name: patient.name,
        imageUrl: patient.imageUrl,
      },
    });
    closeModal?.(false);
  };

  const handleEditMedication = () => {
    navigation.navigate(Screens.SearchMedicationScreen, {
      medication,
      from: 'DOCTOR',
      isEdit: true,
      patient: {
        id: patient.id,
        name: patient.name,
        imageUrl: patient.imageUrl,
      },
    });
    closeModal?.(false);
  };

  const actions = useMemo(() => {
    let options = [
      {
        id: '2',
        title: 'Edit medication',
        icon: <PencilIcon />,
        onPress: handleEditMedication,
      },
      {
        id: '3',
        title: 'Medication history',
        icon: <ParagraphCheckIcon />,
        onPress: handleViewMedicationHistory,
      },
      {
        id: '4',
        title: 'Remove medication',
        icon: <TrashIcon />,
        onPress: handleRemoveMedication,
        isLoading: removingMedication,
      },
    ];
    if (medication?.status !== 'CONFIRMED') {
      options = [
        {
          id: '1',
          title: 'Confirm medication',
          icon: <StampIcon />,
          onPress: handleConfirmMedication,
          isLoading: confirmingMedication,
        },
        ...options,
      ];
    }
    return options;
  }, [confirmingMedication, removingMedication]);

  const disabled = useMemo(() => confirmingMedication, []);

  return (
    <Block>
      <Typography variation="title1Bolder">{medication?.name}</Typography>
      <Typography variation="title3">{medication?.dosage}</Typography>

      <Block mT="xl">
        {actions.map((action, index) => (
          <Block
            pV="xl"
            bC="lightest"
            key={action.id}
            flexDirection="row"
            bBW={index === actions.length - 1 ? 0 : 1}
            onPress={!disabled ? action.onPress : undefined}>
            {action.icon}
            <Typography
              mL="md"
              mR="auto"
              variation="title3"
              color={action.title.includes('Remove') ? 'negativeAction' : 'secondaryBlue'}>
              {action.title}
            </Typography>
            {action.isLoading && <ActivityIndicator />}
          </Block>
        ))}
      </Block>
    </Block>
  );
};

export default MedicationActions;
