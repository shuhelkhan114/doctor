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
import { refetchPatient } from '@store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import { Medication } from '@typings/model/medication';
import { ActivityIndicator } from 'react-native';
import { useMutation } from 'react-query';

interface MedicationActionsProps {
  medication?: Medication;
  closeModal?: (visible: false) => void;
}

// TODO: Refactor this to be a common components between doctor and patient
const MedicationActions: React.FC<MedicationActionsProps> = (props) => {
  const { medication, closeModal } = props;

  const navigation =
    useNavigation<StackNavigationProp<PatientsStackScreens, Screens.PatientDetailScreen>>();
  const dispatch = useAppDispatch();
  const patient = useAppSelector((state) => state.auth.patient);

  const { isLoading: confirmingMedication, mutate: confirmMedication } = useMutation(
    API.patient.medication.confirmMedication,
    {
      onSuccess: () => {
        toast.success('Medication confirmed');
        dispatch(refetchPatient());
        closeModal?.(false);
      },
      onError: () => {
        toast.error('Error confirming medication, please try again!');
      },
    }
  );

  const { isLoading: removingMedication, mutate: removeMedication } = useMutation(
    API.patient.medication.removeMedication,
    {
      onSuccess: () => {
        toast.success(`${medication?.name} removed`);
        dispatch(refetchPatient());
        closeModal?.(false);
      },
      onError: () => {
        toast.error(`Error removing ${medication?.name}, please try again!`);
      },
    }
  );

  const handleConfirmMedication = () => {
    confirmMedication(medication?.id!);
  };

  const handleRemoveMedication = () => {
    removeMedication(medication?.id!);
  };

  const handleViewMedicationHistory = () => {
    navigation.navigate(Screens.MedicationHistoryScreen, {
      medication: medication!,
      patient: {
        name: `${patient?.first_name} ${patient?.last_name}`,
        imageUrl: patient?.patient_image_resized[3].image_url!,
      },
    });
    closeModal?.(false);
  };

  const handleEditMedication = () => {
    navigation.navigate(Screens.SearchMedicationScreen, {
      medication,
      from: 'PATIENT',
      isEdit: true,
      patient: {
        id: patient?.id!,
        name: `${patient?.first_name} ${patient?.last_name}`,
        imageUrl: patient?.patient_image_resized[3].image_url!,
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
