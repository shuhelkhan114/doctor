import Block, { BlockProps } from '@components/Block/Block';
import Icon from '@components/Icon/Icon';
import TickIcon from '@components/Icons/TickIcon';
import Image from '@components/Image/Image';
import Spinner from '@components/Loaders/Spinner';
import Typography from '@components/Typography/Typography';
import toast from '@core/lib/toast';
import API from '@core/services';
import useAppTheme from '@hooks/useTheme';
import { fetchPatient } from '@store/slices/authSlice';
import { useAppDispatch } from '@store/store';
import { Doctor } from '@typings/model/doctor';
import React, { useState } from 'react';
import { useMutation } from 'react-query';

interface DoctorRowProps extends BlockProps {
  doctor: Doctor;
}

type RowState = 'default' | 'sent';

const DoctorRow: React.FC<DoctorRowProps> = (props) => {
  const { doctor } = props;

  const [state, setState] = useState<RowState>('default');

  const theme = useAppTheme();
  const dispatch = useAppDispatch();

  const { isLoading, mutateAsync: sendRequest } = useMutation(API.patient.request.sendRequest, {
    onSuccess() {
      toast.success(`Request sent to ${doctor.first_name}`);
      dispatch(fetchPatient());
      setState('sent');
    },
    onError(error: any) {
      toast.error(error?.response?.data.message || 'Something went wrong, please try again!');
    },
  });

  const handleSendRequest = async () => {
    if (doctor.availablity === 'ACCEPTING') {
      if (state !== 'sent') {
        sendRequest(doctor.id);
      }
    } else {
      toast.error('Doctor is not accepting new patients', undefined, undefined, 'bottom');
    }
  };

  let icon: React.ReactNode = null;

  if (isLoading) {
    icon = <Spinner />;
  } else if (state === 'default') {
    icon = (
      <Icon
        name="user-add"
        color={doctor.availablity === 'NOT_ACCEPTING' ? theme.colors.dark : theme.colors.mainBlue}
      />
    );
  } else {
    icon = <TickIcon fill={theme.colors.mainBlue} />;
  }

  return (
    <Block pV="xl" align="center" key={doctor.id} flexDirection="row">
      <Image mR="xl" uri={doctor.doctor_image} size={56} circular />
      <Block mR="auto" flex1>
        <Typography variation="title3" numberOfLines={2}>
          {doctor.first_name} {doctor.last_name}
        </Typography>
        <Typography color="dark" variation="description1" numberOfLines={2}>
          {doctor.speciality}
        </Typography>
        {doctor.city && (
          <Typography color="dark" variation="description1" numberOfLines={2}>
            {doctor.city ? `${doctor.city}, ` : ''}
            {doctor.state}
          </Typography>
        )}
      </Block>
      <Block align="flex-end" onPress={handleSendRequest}>
        <Typography color="dark" variation="description1">
          {doctor.personal_code}
        </Typography>
        {icon}
      </Block>
    </Block>
  );
};

export default DoctorRow;
