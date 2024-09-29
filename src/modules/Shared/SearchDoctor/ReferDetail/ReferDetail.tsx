import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import Typography from '@components/Typography/Typography';
import toast from '@core/lib/toast';
import API from '@core/services';
import PatientRow from '@modules/Doctor/Patients/PatientRow/PatientRow';
import DoctorRow from '@modules/Patient/SearchDoctors/DoctorRow';
import { useNavigation } from '@react-navigation/native';
import { PatientRowData } from '@typings/common';
import { Doctor } from '@typings/model/doctor';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';

interface ReferDetailProps {
  doctor?: Doctor;
  patient: PatientRowData;
  onClose?: (visible: false) => void;
}

const ReferDetail: React.FC<ReferDetailProps> = (props) => {
  const { patient, doctor, onClose } = props;

  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  const { isLoading, mutate: referPatient } = useMutation(API.doctor.request.referPatient, {
    onSuccess() {
      toast.success(`${patient.name} is referred to ${doctor?.first_name}`);
      queryClient.refetchQueries(['common/doctors']);
      onClose?.(false);
      navigation.goBack();
    },
    onError() {
      toast.error('Unable to refer patient, please try again!');
    },
  });

  const handleRefer = () => {
    referPatient({
      patientId: patient.id,
      doctorId: doctor?.id!,
    });
  };

  if (!doctor) {
    return <Block />;
  }

  return (
    <Block>
      <Typography variation="title2" color="black">
        Patient
      </Typography>

      <PatientRow
        name={patient.name}
        doctorsCount={0}
        healthIssuesCount={0}
        imageUrl={patient.imageUrl}
      />

      <Typography variation="title2" color="black" mT="4xl">
        Refer to
      </Typography>

      <DoctorRow disabled physician={doctor} />

      <Button
        mT="4xl"
        icon="user-add"
        iconColor="white"
        loading={isLoading}
        title="Refer Patient"
        onPress={handleRefer}
      />
    </Block>
  );
};

export default ReferDetail;
