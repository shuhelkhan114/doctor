import React from 'react';

import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import ErrorText from '@components/ErrorText/ErrorText';
import Image from '@components/Image/Image';
import Typography from '@components/Typography/Typography';
import toast from '@core/lib/toast';
import API from '@core/services';
import { fetchPatient } from '@store/slices/authSlice';
import { useAppDispatch } from '@store/store';
import { PatientRequest } from '@typings/api-responses/responses';
import { useMutation } from 'react-query';

interface RequestDetailProps {
  request: PatientRequest;
  closeModal?: (visible: false) => void;
}

const RequestDetail: React.FC<RequestDetailProps> = (props) => {
  const { request, closeModal } = props;
  const { doctor } = request;

  const dispatch = useAppDispatch();

  const {
    isLoading,
    error,
    mutate: removeRequest,
  } = useMutation(API.patient.request.removeRequest, {
    onSuccess() {
      dispatch(fetchPatient());
      closeModal?.(false);
      toast.success(`Request to ${doctor.first_name} removed`);
    },
    onError() {
      toast.error('Unable to remove request, please try again!');
    },
  });

  const handleRemove = () => {
    removeRequest(request.id);
  };

  return (
    <Block>
      <Block flexDirection="row" align="center" bBW={1} bC="lightest" pB="lg">
        <Image mR="xl" uri={doctor.doctor_image} circular size={56} />
        <Block>
          <Typography variation="title3">
            {doctor.first_name} {doctor.last_name}
          </Typography>
          <Typography variation="title3" color="dark">
            {doctor.speciality}
          </Typography>
        </Block>
      </Block>

      <Typography mT="xxxl" variation="title3" color="black">
        Request sent
      </Typography>

      <Typography variation="description1" color="dark" mT="md">
        {new Date(request.created_at).toDateString()}
      </Typography>

      <ErrorText error={error} />

      <Button
        mT="xxxl"
        variation="link"
        loading={isLoading}
        onPress={handleRemove}
        title="Remove Request"
      />
    </Block>
  );
};

export default RequestDetail;
