import Block from '@components/Block/Block';
import ErrorText from '@components/ErrorText/ErrorText';
import TrashIcon from '@components/Icons/TrashIcon';
import Spinner from '@components/Loaders/Spinner';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import toast from '@core/lib/toast';
import API from '@core/services';
import PatientRow from '@modules/Doctor/Patients/PatientRow/PatientRow';
import { PatientsStackScreens } from '@navigation/Doctor/PatientsStack';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PatientRowData } from '@typings/common';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';

interface RemovePatientProps {
  patient: PatientRowData;
  closeModal: (value: false) => void;
}

const RemovePatient: React.FC<RemovePatientProps> = (props) => {
  const { patient, closeModal } = props;

  const navigation =
    useNavigation<StackNavigationProp<PatientsStackScreens, Screens.PatientDetailScreen>>();
  const queryClient = useQueryClient();

  const {
    isLoading,
    error,
    mutate: removePatient,
  } = useMutation(API.doctor.patient.removePatient, {
    onSuccess() {
      toast.success(`${patient.name} removed successfully!`);
      closeModal?.(false);
      queryClient.invalidateQueries('doctor/patients');
      navigation.goBack();
    },
    onError() {
      toast.error('Unable to remove patient, please try again!');
    },
  });

  const handleRemove = () => {
    removePatient(patient.id);
  };

  return (
    <Block>
      <PatientRow
        name={patient?.name}
        imageUrl={patient?.imageUrl}
        doctorsCount={patient?.doctorsCount}
        healthIssuesCount={patient?.healthIssuesCount}
      />
      {isLoading ? (
        <Spinner mT="xxxl" />
      ) : (
        <Block pT="xxxl" flexDirection="row" align="center" onPress={handleRemove}>
          <TrashIcon />
          <Typography color="negativeAction" mL="md">
            Remove
          </Typography>
        </Block>
      )}
      <ErrorText error={error} />
    </Block>
  );
};

export default RemovePatient;
